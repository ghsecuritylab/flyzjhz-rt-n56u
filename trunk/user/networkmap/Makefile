EXEC = networkmap
OBJS = function.o networkmap.o

SHDIR = $(ROOTDIR)/user/shared
USERDIR = $(ROOTDIR)/user

CFLAGS  += -Wall -I. -I$(SHDIR) -I$(SHDIR)/include
CFLAGS  += -s -DNO_PARALLEL
#CFLAGS  += -DDEBUG -DDEBUG_MORE

LDFLAGS += -L$(SHDIR) -lshared

all: $(EXEC)

$(EXEC): $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS) $(CFLAGS)

romfs:
	$(ROMFSINST) /usr/sbin/$(EXEC)

clean: 
	rm -rf *.o $(EXEC) *~

