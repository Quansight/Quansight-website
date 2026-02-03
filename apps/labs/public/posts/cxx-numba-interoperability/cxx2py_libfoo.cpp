#include <memory>
#include <cstdint>
#include "foo.hpp"

extern "C" intptr_t get_foo_address() {
  /* int (int) */
  return reinterpret_cast<intptr_t>(std::addressof(foo));
}


extern "C" intptr_t get_ns__ns2__bar_address() {
  /* double (double) */
  return reinterpret_cast<intptr_t>(std::addressof(ns::ns2::bar));
}


extern "C" intptr_t get_ns__BarCls__fun_address() {
  /* int () */
  return reinterpret_cast<intptr_t>(std::addressof(ns::BarCls::fun));
}
