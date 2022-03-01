#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
  for (int i = 1; i < argc; i++) {
    printf("Argument %d: %s\n", i, argv[i]);
  }

  int val = 0, tot = 0;

  printf("hello, a value please:\n");
  scanf("%d", &val);
  tot += val;
  printf("got the value %d\n", val);

  printf("another value:\n");
  scanf("%d", &val);
  tot += val;
  printf("got the value %d\n", val);

  printf("and one more value:\n");
  scanf("%d", &val);
  tot += val;
  printf("got the value %d\n", val);

  printf("\nsum of all values is %d\n", tot);

  return 0;
}