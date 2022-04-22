#include "mytest/placeholder_library.hpp"

#define BOOST_TEST_MAIN
#include <boost/test/unit_test.hpp>

BOOST_AUTO_TEST_CASE( my_unit_test ) {
    BOOST_TEST( mytest::returnOne() == 1);
}