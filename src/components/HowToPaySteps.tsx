const STEPS = [
  {
    number: "01",
    title: "Clique em COPIAR CHAVE PIX.",
    description:
      "A chave CPF 11660691761 é salva automaticamente na área de transferência do seu dispositivo.",
  },
  {
    number: "02",
    title: "Abra o aplicativo do seu banco.",
    description:
      "Acesse o aplicativo do seu banco favorito e entre na área Pix.",
  },
  {
    number: "03",
    title: "Cole a chave Pix e confirme o pagamento.",
    description:
      "Escolha pagar com Chave Pix (CPF), confira o nome de Maicon Cezar Barroso e conclua.",
  },
];

export function HowToPaySteps() {
  return (
    <section
      id="como-pagar"
      aria-labelledby="steps-heading"
      className="w-full"
    >
      <div className="text-center mb-6">
        <h2
          id="steps-heading"
          className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Como realizar seu pagamento
        </h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {STEPS.map((step, index) => (
          <li
            key={step.number}
            className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.08)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 text-white font-mono tabular-nums text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Passo {index + 1} de 3
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900 leading-snug">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
