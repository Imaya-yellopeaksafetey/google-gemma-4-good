**Preventive Local Handling Note**

Preventive questions are no longer forced through the emergency controller when routed locally first.

Behavior:
- if online:
  - preventive queries are classified locally, then sent to the richer cloud preventive path
- if offline:
  - the app returns a limited local preventive message
  - it tells the worker to reconnect for full SDS-grounded preventive guidance

Safety principle:
- no fabricated rich preventive guidance in offline local mode

Current state:
- implemented in app route handling
- cloud preventive path remains available
- direct emulator completion of a preventive local/offline flow still needs one more interaction proof
