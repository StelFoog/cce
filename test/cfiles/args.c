#include <stdio.h>
#include <stdlib.h>

#include "./argPrinter.h"

int main(int argc, char* argv[]) {
  argumentPrinter(argc, argv);

  printf("%d total arguments\n", argc - 1);

  return 0;
}
