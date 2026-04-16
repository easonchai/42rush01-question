NAME = rush-01
CC = cc
CFLAGS = -Wall -Wextra -Werror
SRCS = main.c parse.c precheck.c visibility.c permgen.c domain.c state.c propagate.c search.c output.c
OBJS = $(SRCS:.c=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) -o $(NAME) $(OBJS)

%.o: %.c rush01.h
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
