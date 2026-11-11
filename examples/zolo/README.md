# Zolo

Light Swaraj game scaffold generated from the Games dashboard.

- **Application id:** `zolo`
- **Mandate:** `mandate/zolo-mandate.json`
- **Client:** `src/swaraj/client.ts`

## Register the mandate

```bash
export SWARAJ_API_URL=http://localhost:3000
export SWARAJ_DEV_TOKEN=…   # ≥32 chars
export SWARAJ_APPLICATION_ID=zolo
pnpm register-mandate
```

Edit rules in the Swaraj dashboard (Games → Zolo) or edit the mandate JSON directly, then Save / Activate.
