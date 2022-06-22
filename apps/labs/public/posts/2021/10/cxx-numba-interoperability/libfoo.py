
# This Python module `libfoo` is auto-generated using cxx2py tool!
__all__ = []
import ctypes
import rbc

def _load_library(name):
    # FIXME: win
    return ctypes.cdll.LoadLibrary(f'lib{name}.so')

_lib = _load_library("cxx2py_libfoo")

_target_info = rbc.targetinfo.TargetInfo('cpu')


_lib.get_foo_address.argtypes = ()
_lib.get_foo_address.restype = ctypes.c_void_p
with _target_info:
    _foo_signature = rbc.typesystem.Type.fromstring("int (int)")
foo = _foo_signature.toctypes()(_lib.get_foo_address())
__all__.append("foo")


_lib.get_ns__ns2__bar_address.argtypes = ()
_lib.get_ns__ns2__bar_address.restype = ctypes.c_void_p
with _target_info:
    _ns__ns2__bar_signature = rbc.typesystem.Type.fromstring("double (double)")
ns__ns2__bar = _ns__ns2__bar_signature.toctypes()(_lib.get_ns__ns2__bar_address())
__all__.append("ns__ns2__bar")


_lib.get_ns__BarCls__fun_address.argtypes = ()
_lib.get_ns__BarCls__fun_address.restype = ctypes.c_void_p
with _target_info:
    _ns__BarCls__fun_signature = rbc.typesystem.Type.fromstring("int ()")
ns__BarCls__fun = _ns__BarCls__fun_signature.toctypes()(_lib.get_ns__BarCls__fun_address())
__all__.append("ns__BarCls__fun")
