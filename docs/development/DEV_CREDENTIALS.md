Dev credentials and helper notes

This file contains quick notes for local development authentication.

Default dev seeded user

- email: test@example.com
- password: password

To (re)create the user locally, run:

```bash
# from repo root
make seed-dev-user
```

To run the backend seeder automatically during local dev, you can call the Makefile target before starting servers.
