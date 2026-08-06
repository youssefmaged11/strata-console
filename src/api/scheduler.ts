export type PendingRequest = {
  id: number;
  label: string;
  resolve: () => void;
  reject: (error: Error) => void;
};

let sequence = 0;
let manual = false;
const pending: PendingRequest[] = [];

export const scheduler = {
  setManual(value: boolean) {
    manual = value;
  },
  reset() {
    manual = false;
    pending.splice(0);
    sequence = 0;
  },
  pending() {
    return pending.map(({ id, label }) => ({ id, label }));
  },
  resolve(id: number) {
    pending.find((request) => request.id === id)?.resolve();
  },
  reject(id: number, message = 'Request failed') {
    pending.find((request) => request.id === id)?.reject(new Error(message));
  },
  async wait(label: string, delay = 90) {
    const id = ++sequence;
    if (!manual) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, delay + (id % 4) * 20));
      return;
    }
    await new Promise<void>((resolve, reject) => {
      pending.push({
        id,
        label,
        resolve: () => {
          pending.splice(pending.findIndex((request) => request.id === id), 1);
          resolve();
        },
        reject: (error) => {
          pending.splice(pending.findIndex((request) => request.id === id), 1);
          reject(error);
        },
      });
    });
  },
};
