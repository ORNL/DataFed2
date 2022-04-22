// Local include
#include "mytest/placeholder_library.hpp"

// Standard includes
#include <iostream>

namespace mytest {
    void func() {
        std::cout << "Hello from the placeholder library!" << std::endl;
        return;
    }

    int returnOne() {
        return 1;
    }
}