// Third party includes
#include <openssl/ssl.h>

int main() {
    const SSL_METHOD* method = TLSv1_2_client_method();
    return 0;
}