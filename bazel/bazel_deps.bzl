# Third-party dependencies fetched by Bazel
# Unlike WORKSPACE, the content of this file is unordered.
# We keep them separate to make the WORKSPACE file more maintainable.

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
def fetch_dependencies():

    # NodeJS Rules
    http_archive(
        name = "build_bazel_rules_nodejs",
        sha256 = "2b2004784358655f334925e7eadc7ba80f701144363df949b3293e1ae7a2fb7b",
        urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/5.4.0/rules_nodejs-5.4.0.tar.gz"],
    )

    # Loading Boost
    _RULES_BOOST_COMMIT = "652b21e35e4eeed5579e696da0facbe8dba52b1f"
    http_archive(
        name = "com_github_nelhage_rules_boost",
        sha256 = "c1b8b2adc3b4201683cf94dda7eef3fc0f4f4c0ea5caa3ed3feffe07e1fb5b15",
        strip_prefix = "rules_boost-%s" % _RULES_BOOST_COMMIT,
        urls = [
            "https://github.com/nelhage/rules_boost/archive/%s.tar.gz" % _RULES_BOOST_COMMIT,
        ],
    )

    # Python
    http_archive(
        name = "rules_python",
        sha256 = "9fcf91dbcc31fde6d1edb15f117246d912c33c36f44cf681976bd886538deba6",
        strip_prefix = "rules_python-0.8.0",
        url = "https://github.com/bazelbuild/rules_python/archive/refs/tags/0.8.0.tar.gz",
    )

    # This is building external projects that use cmake and other build configuration
    http_archive(
        name = "rules_foreign_cc",
        sha256 = "bcd0c5f46a49b85b384906daae41d277b3dc0ff27c7c752cc51e43048a58ec83",
        strip_prefix = "rules_foreign_cc-0.7.1",
        url = "https://github.com/bazelbuild/rules_foreign_cc/archive/1.11.1.tar.gz",
    )

    # External Dependency
    # poco source code repository
    _ALL_CONTENT = """\
filegroup(
    name = "all_srcs",
    srcs = glob(["**"]),
    visibility = ["//visibility:public"],
)
"""

    http_archive(
        name = "poco",
        build_file_content = _ALL_CONTENT,
        strip_prefix = "poco-poco-1.11.1-release",
        urls = [
            "https://github.com/pocoproject/poco/archive/refs/tags/poco-1.11.1-release.tar.gz",
        ],
        sha256 = "2412a5819a239ff2ee58f81033bcc39c40460d7a8b330013a687c8c0bd2b4ac0",
    )

    http_archive(
        name = "openssl",
        build_file_content = _ALL_CONTENT,
        strip_prefix = "openssl-openssl-3.0.2",
        urls = [
            "https://github.com/openssl/openssl/archive/refs/tags/openssl-3.0.2.tar.gz",
        ],
        sha256 = "9f54d42aed56f62889e8384895c968e24d57eae701012776d5f18fb9f2ae48b0",
    )