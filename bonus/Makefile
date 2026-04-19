NAME = rush-01
CC = cc
CFLAGS = -Wall -Wextra -O3 -pthread -march=native
LDFLAGS = -pthread
SRCS = main.c parse.c parse_utils.c precheck.c visibility.c \
       permgen.c permgen_utils.c domain.c bitset.c \
       state.c state_free.c \
       propagate.c propagate_posval.c propagate_kill.c \
       search.c search_mrv.c search_snap.c search_restore.c \
       output.c
OBJS = $(SRCS:.c=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) -o $(NAME) $(OBJS) $(LDFLAGS)

%.o: %.c rush01.h
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
