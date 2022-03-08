#include <stdio.h>
#include <stdlib.h>

#include "./args.h"
#include "hello/world.h"

int main(int argc, char* argv[]) {
  printf("Include test\n");

  helloWorld();
  argPrint(argc, argv);

  return 0;
}
