export const sleep = (time = 2000) =>
  new Promise(resolve => setTimeout(resolve, time));

interface waitForSomethingArg {
  func: Function;
  timeout?: number;
}

export const waitForSomething = async (
  { func, timeout }: waitForSomethingArg,
  sleepTime = 0
) => {
  if (timeout) {
    if (sleepTime >= timeout) {
      return false;
    }
  }

  const r = await func();

  if (r) {
    return r;
  }

  await sleep(50);

  return waitForSomething({ func, timeout }, 50 + sleepTime);
};
