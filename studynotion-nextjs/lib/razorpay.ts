import Razorpay from "razorpay";

let _instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_instance) {
    _instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });
  }
  return _instance;
}

export default new Proxy({} as Razorpay, {
  get(_target, prop) {
    const inst = getRazorpay() as any;
    const val = inst[prop];
    return typeof val === "function" ? val.bind(inst) : val;
  },
});
