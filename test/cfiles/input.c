#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int val = 0, tot = 0;

  scanf("%d", &val);
  tot += val;
  printf("recived: %d\n", val);

  scanf("%d", &val);
  tot += val;
  printf("recived: %d\n", val);

  scanf("%d", &val);
  tot += val;
  printf("recived: %d\n", val);

  printf("\nsum: %d\n", tot);

  return 0;
}