## Self-hosting

This community node also supports self-hosted ntfy instances. 

To self-host a protected ntfy instance:

1. Start service:

```sh
touch docker-compose.ntfy.yml
# edit as needed
docker-compose -f docker-compose.ntfy.yml up -d
```

2. Create user:

```sh
docker exec -it ntfy ntfy user add --role=admin your_username
```

3. Set up subdomain in DNS provider and in reverse proxy, e.g. Caddy:

```Caddyfile
ntfy.domain.com {
	reverse_proxy localhost:8088
	health_uri /v1/health
	health_interval 60s
}
```
