# matrix4
A small library/compilation of 4x4 matrix maths functions.

Originally written in Java and reimplemented in JavaScript by me. I use it for doing
Webgl transformations/translations and found it was a fun exercise writing the
matrix functions myself.
Contains an executor function that will take an array of arrays that
contains a string that matches the respective matrix functions and their numerical arguments
and execute the functions with the arguments in turn.
Does allocate new temporary matrix which is wasteful.
There is also a perspective function.
