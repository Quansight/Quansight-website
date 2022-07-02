# Author: Pearu Peterson
# Created: October 2021

import os
import re
import sys
import argparse
import subprocess


class Node:
    """Node represents a pair of key and value.
 
    Node may have children nodes.
    All non-root nodes have parents.
    """

    def __init__(self, parent, prefix, key, value):
        assert isinstance(parent, (Node, type(None)))
        assert isinstance(key, str), key
        assert isinstance(value, str), value
        self.parent = parent
        self.prefix = prefix  # used only when parsing clang dump output
        self.key = key
        self._value = value   # original value, unused
        self.loc = get_path(value)

        if key == 'TranslationUnitDecl':
            value = ''
        elif key in ['NamespaceDecl', 'AccessSpecDecl', 'LinkageSpecDecl']:
            # take last word
            value = value.rsplit(None, 1)[-1]
        elif key in ['TypedefDecl', 'CXXMethodDecl', 'CXXConstructorDecl', 'CXXDestructorDecl',
                     'ParmVarDecl', 'TypeAliasDecl', 'EnumConstantDecl', 'FunctionDecl',
                     'VarDecl', 'FieldDecl', 'IndirectFieldDecl', 'UnresolvedUsingValueDecl',
                     ]:
            # name 'signature' rest
            # warning: pre-name part may be relevant as well
            i = value.find("'")
            j = value.rfind("'")
            assert -1 not in {i, j}, (key, value)
            name = value[:i].rstrip().rsplit(None, 1)[-1]
            if key == 'ParmVarDecl' and ':' in name:
                name = ''
            sig = value[i:j+1]
            rest = value[j+1:].lstrip()
            value = f'{name} {sig} {rest}'
        elif key == 'CXXRecordDecl':
            m = re.match(r'.*\b(struct|class)\b\s+(.*)\s+definition', value)
            if m is not None:
                value = '%s %s' % m.groups()
            else:
                value = '...'
        elif key in ['UsingShadowDecl', 'CXXConversionDecl', 'NonTypeTemplateParmDecl', 'UsingDirectiveDecl',
                     'FriendDecl', 'EnumDecl', 'ClassTemplateDecl', 'TemplateTypeParmDecl',
                     'ClassTemplateSpecializationDecl', 'TypeAliasTemplateDecl', 'FunctionTemplateDecl',
                     'UsingDecl', 'ClassTemplatePartialSpecializationDecl', 'TemplateTemplateParmDecl',
                     'StaticAssertDecl', 'VarTemplateDecl', '']:
            # TODO: process only if needed
            value = '...'
        elif key.endswith('Decl'):
            # reporting just for awareness
            print(f'TODO[{key}]: {value}')
            assert "'" not in value
        self.value = value
        self.nodes = []

    def __repr__(self):
        return f'{self.key}({self.value!r})'
        
    def tostring(self, tab='', filter=None):
        lines = []
        lines.append(f'{tab}{self.key}:{self.value}')
        for node in self.nodes:
            if filter is None or filter(node):
                lines.append(node.tostring(tab=tab + '  ',
                                           filter=filter))
        return '\n'.join(lines)

    def __str__(self):
        return self.tostring(filter=lambda node: node.key.endswith('Decl'))

    def traverse(self, predicate, reversed=False):
        if predicate(self):
            yield self

        if reversed:
            if self.parent is not None:
                yield from self.parent.traverse(predicate, reversed=reversed)
        else:
            for node in self.nodes:
                yield from node.traverse(predicate, reversed=reversed)

    def iter(self, key, reversed=False):
        return self.traverse(lambda node: node.key == key, reversed=reversed)

    def cleanup(self):
        if self.key == 'NamespaceDecl':
            if self.value == 'std' or self.value.startswith('_'):
                return
        if self.key in ['FunctionDecl', 'TypedefDecl']:
            if self.value.startswith('_') or self.value.split(None, 1)[0] in ['new', 'delete', 'new[]', 'delete[]']:
                return
        nodes = []
        public = True
        for node in self.nodes:
            if node.key == 'AccessSpecDecl':
                public = dict(private=False, public=True, protected=False)[node.value]
            if not public:
                continue
            node = node.cleanup()
            if node is None:
                continue
            nodes.append(node)

        if self.key in ['LinkageSpecDecl'] and not nodes:
            return

        if self.loc is not None:
            if self.loc.startswith(sys.prefix):
                return

        if self.key in ['EnumDecl', 'TypedefDecl']:
            return

        if self.key == 'CXXRecordDecl' and (self.value == '...' or self.value.split(None, 1)[-1].startswith('_')):
            return
        
        obj = object.__new__(Node)
        obj.parent = self.parent
        obj.key = self.key
        obj.value = self.value
        obj._value = self._value
        obj.nodes = nodes
        obj.loc = self.loc
        return obj


def get_path(value):
    m = re.match(r'.*[<]([^\s]*[.](hpp|hxx|h))[:]\d+[:]\d+', value)
    if m is not None:
        p = m.group(1)
        return p

    
def parse_ast_dump(ast_dump_output):
    """Parse clang ast dump output into a Node tree.
    """
    for line in ast_dump_output.splitlines():
        prefix, rest = line.split('-', 1) if '-' in line else ('', line)
        lst = rest.split(None, 1)
        key, value = lst if len(lst) == 2 else (lst[0], '')
        if not prefix:
            root = current = Node(None, prefix, key, value)
        else:
            if len(current.prefix) < len(prefix):
                node = Node(current, prefix, key, value)
                current.nodes.append(node)
            else:
                while len(current.prefix) > len(prefix):
                    current = current.parent
                assert current.prefix[:-1] == prefix[:-1], (current.prefix, prefix)
                node = Node(current.parent, prefix, key, value)
                current.parent.nodes.append(node)
            current = node
    return root.cleanup()


python_module_tmpl = '''
# This Python module `{modulename}` is auto-generated using cxx2py tool!
__all__ = []
import ctypes
import rbc

def _load_library(name):
    # FIXME: win
    return ctypes.cdll.LoadLibrary(f'lib{{name}}.so')

_lib = _load_library("{shared_library_name}")

_target_info = rbc.targetinfo.TargetInfo('cpu')
'''

python_function_tmpl = '''
_lib.get_{ns_fname}_address.argtypes = ()
_lib.get_{ns_fname}_address.restype = ctypes.c_void_p
with _target_info:
    _{ns_fname}_signature = rbc.typesystem.Type.fromstring("{signature}")
{ns_fname} = _{ns_fname}_signature.toctypes()(_lib.get_{ns_fname}_address())
__all__.append("{ns_fname}")
'''

cxx_function_tmpl = '''
extern "C" intptr_t get_{ns_fname}_address() {{
  /* {signature} */
  return reinterpret_cast<intptr_t>(std::addressof({cpp_fname}));
}}
'''

def main():

    parser = argparse.ArgumentParser(description='Generate ctypes wrappers to C++ library functions')
    parser.add_argument('-m', '--modulename', type=str, default='untitled',
                        help='Python module name of ctypes wrappers (default: %(default)s)')
    parser.add_argument('file', type=str, nargs='+', help='C++ header/source file')
    parser.add_argument('--clang-exe', type=str, default='clang++',
                        help='Path to clang compiler (default: %(default)s)')
    parser.add_argument('--clang-ast-dump-flags',
                        type=str, default='-Xclang -ast-dump -fsyntax-only -fno-diagnostics-color',
                        help='Override flags to clang ast dump command (default: %(default)r)')
    parser.add_argument('--clang-build-flags',
                        type=str, default='-shared -fPIC',
                        help='Override flags to clang build shared library command (default: %(default)r)')
    parser.add_argument('--clang-extra-flags',
                        type=str, default='',
                        help='Extra flags to clang command (default: %(default)r)')
    parser.add_argument('--build', default=False, action='store_true',
                        help='Build shared library (default: %(default)s)')
    parser.add_argument('--verbose', default=False, action='store_true',
                        help='Be verbose (default: %(default)s)')

    args = parser.parse_args()

    if args.verbose:
        print(args)

    cpp_filename = f'cxx2py_{args.modulename}.cpp'
    py_filename = f'{args.modulename}.py'
    shared_library_name = f'cxx2py_{args.modulename}'
    shared_library_suffix = 'lib'  # FIXME: win
    shared_library_ext = '.so'     # FIXME: win
    shared_library_filename = shared_library_suffix + shared_library_name + shared_library_ext

    header_files = [fn for fn in args.file if os.path.splitext(fn)[1].lower() in ['.h', '.hpp', '.hxx']]
    source_files = [fn for fn in args.file if fn not in header_files]

    source_files.append(cpp_filename)  # FIXME: use tmp location

    clang_ast_dump_cmd = [args.clang_exe] + args.clang_ast_dump_flags.split() + args.clang_extra_flags.split() + header_files

    # Parse C++ files using clang AST dump
    if args.verbose:
        print(' '.join(clang_ast_dump_cmd))

    output = subprocess.run(clang_ast_dump_cmd, capture_output=True)
    if output.returncode:
        print(output.stderr.decode())
        sys.exit(output.returncode)

    ast = parse_ast_dump(output.stdout.decode())

    if args.verbose:
        print(f'{"="*80}\n  AST\n{"="*80}\n{ast}')

    # Create wrappers
    cpp_code = []
    py_code = [python_module_tmpl.format_map(dict(modulename=args.modulename,
                                                  shared_library_name=shared_library_name))]

    cpp_code.append('#include <memory>')
    cpp_code.append('#include <cstdint>')

    for fn in header_files:
        cpp_code.append(f'#include "{fn}"')
    
    # Create wrappers to C++ functions
    for func_decl in ast.iter('FunctionDecl'):
        namespace_decls = list(func_decl.iter('NamespaceDecl', reversed=True))[::-1]
        fname = func_decl.value.split(None, 1)[0]
        signature = func_decl.value.split("'")[1]
        cpp_fname='::'.join([ns.value for ns in namespace_decls] + [fname])
        ns_fname='__'.join([ns.value for ns in namespace_decls] + [fname])
        params = dict(fname=fname, cpp_fname=cpp_fname, ns_fname=ns_fname,
                      signature=signature, signature_len=len(signature)+1)
        cpp_code.append(cxx_function_tmpl.format_map(params))
        py_code.append(python_function_tmpl.format_map(params))

    # Create wrappers to C++ class static member functions
    for meth_decl in ast.iter('CXXMethodDecl'):
        if not meth_decl.value.endswith('static'):
            continue
        cls_decl = meth_decl.parent
        assert cls_decl.key == 'CXXRecordDecl', cls_decl
        namespace_decls = list(cls_decl.iter('NamespaceDecl', reversed=True))[::-1]

        clsname = cls_decl.value.rsplit(None, 1)[-1]
        fname = meth_decl.value.split(None, 1)[0]
        signature = meth_decl.value.split("'")[1]
        cpp_fname = '::'.join([ns.value for ns in namespace_decls] + [clsname, fname])
        ns_fname='__'.join([ns.value for ns in namespace_decls] + [clsname, fname])
        params = dict(fname=fname, cpp_fname=cpp_fname, ns_fname=ns_fname,
                      signature=signature, signature_len=len(signature)+1)
        cpp_code.append(cxx_function_tmpl.format_map(params))
        py_code.append(python_function_tmpl.format_map(params))

    cpp_code = '\n'.join(cpp_code)
    py_code = '\n'.join(py_code)

    if args.verbose:
        print(f'{"="*80}\n  Wrapper C++ code\n{"="*80}\n{cpp_code}')

    if args.verbose:
        print(f'{"="*80}\n  Wrapper Python code\n{"="*80}\n{py_code}')

    if args.verbose:
        print(f'Creating {cpp_filename}')
    
    with open(cpp_filename, 'w') as f:
        f.write(cpp_code)

    if args.verbose:
        print(f'Creating {py_filename}')
        
    with open(py_filename, 'w') as f:
        f.write(py_code)

    if args.build:
        clang_build_cmd = [args.clang_exe] + args.clang_build_flags.split() + args.clang_extra_flags.split() + source_files + ['-o', shared_library_filename]

        # Build shared library
        if args.verbose:
            print(f'Creating {shared_library_filename}')

        if args.verbose:
            print(' '.join(clang_build_cmd))
        output = subprocess.run(clang_build_cmd, capture_output=True)
        if output.returncode:
            print(output.stderr.decode())
            sys.exit(output.returncode)

    print(f'DONE\n\nAs a quick test, try running:\n\n  LD_LIBRARY_PATH=. python -c "import {args.modulename} as m; print(m.__all__)"')

if __name__ == '__main__':
    main()
