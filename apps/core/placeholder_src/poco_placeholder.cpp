

// Third party includes
#include "Poco/URI.h"

// Standard includes
#include <iostream>
#include <string>

int main() {
    std::cout << "Saying Hello from a script including poco_uri" << std::endl;
    std::string uri = "https://github.com";
    Poco::URI poco_uri(uri);
    return 0;
}