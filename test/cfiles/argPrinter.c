#include <stdio.h>

void argumentPrinter(int argc, char* argv[]) {
  for (int i = 1; i < argc; i++) {
    printf("Argument %d: %s\n", i, argv[i]);
  }
}
