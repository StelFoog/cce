int main(void) {
  int val = 0, tot = 0;

  printf("enter value 1:\n");
  scanf("%d", &val);
  tot += val;
  printf("recived: %d\n", val);

  printf("enter value 2:\n");
  scanf("%d", &val);
  tot += val;
  printf("recived: %d\n", val);

  printf("enter value 3:\n");
  scanf("%d", &val);
  tot += val;
  printf("recived: %d\n", val);

  printf("\nsum of values: %d\n", tot);

  return 0;
}