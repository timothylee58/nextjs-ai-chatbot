import { motion } from "framer-motion";

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl md:text-2xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Hai! Saya Nak Tahu AI.
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-zinc-500 text-base md:text-lg"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Speak Malaysian, Think Lokal.
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-zinc-400 text-sm md:text-base mt-1"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
      >
        Apa yang boleh saya bantu hari ini?
      </motion.div>
    </div>
  );
};
