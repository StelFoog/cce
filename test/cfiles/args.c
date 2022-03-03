#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
  for (int i = 1; i < argc; i++) {
    printf("Argument %d: %s\n", i, argv[i]);
  }

  printf("%d total arguments\n", argc - 1);

  return 0;
}