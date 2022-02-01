# deliveryclub-couriers

### First time setup

1. Add executable rights to ***./sail***.
```bash
chmod +x ./sail
```

### Setup

1. Change .env for correct configuration using .env.example as template.
2. (Optional) Uncomment **[program:node]** section in **./docker/app/17.0/supervisord.conf**. \

### Launch

1. Launch docker containers using sail.
```bash
./sail up -d
```

2. (Optional: If **[program:node]** is commented) \
Run web server using yarn.
```bash
./sail yarn dev
```

3. (Optional: Background jobs) Use to listen for Bull jobs queu:
```bash
./sail ace bull:listen
```

### Use

1. Use **./sail** to run **docker-compose**, **docker**, **yarn**, **node**, **ace**. \
Sail is used to shallow frequently used commands and run them on **app* container.
```bash
./sail up -d # runs docker-compose up
```
2. Use **./sail** to access shell inside **app** container.

```bash
./sail shell # user shell
./sail root-shell # root shell
```
