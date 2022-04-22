#!/usr/bin/env python3

# Local imports
from mypython import mypython

# Standard imports
import unittest

class TestReturnTwo(unittest.TestCase):

    def test_returnTwo(self):
        self.assertEqual(mypython.returnTwo(), 2)

if __name__ == '__main__':
    unittest.main()
