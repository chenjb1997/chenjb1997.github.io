import { useId, useState } from "react";
import { ArrowUpRight, BrainCircuit, ChevronDown, Network, Pin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { labMark, labName } from "../../features/lab/brand";
import { labBranches } from "../../features/lab/data";

function ResearchDirection({ title, body, isAlgo }: { title: string; body: string; isAlgo: boolean }) {
  const { t } = useTranslation();
  const bodyId = useId();
  const [previewing, setPreviewing] = useState(false);
  const [pinned, setPinned] = useState(false);
  const expanded = previewing || pinned;
  const accent = isAlgo ? "text-teal-700" : "text-orange-700";

  function close() {
    setPinned(false);
    setPreviewing(false);
  }

  return (
    <li
      className={`rounded border bg-white ${expanded ? (isAlgo ? "border-teal-300" : "border-orange-300") : "border-gray-200"}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPreviewing(true);
      }}
      onPointerLeave={() => setPreviewing(false)}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={bodyId}
        className="grid min-h-11 w-full grid-cols-[6px_minmax(0,1fr)_16px_16px] items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold leading-snug text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-600"
        onClick={() => pinned ? close() : setPinned(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && expanded) close();
        }}
      >
        <span className={`size-1.5 rounded-full bg-current ${accent}`} aria-hidden="true" />
        <span>{title}</span>
        {pinned ? (
          <span className={accent} title={t("lab-direction-pinned")}>
            <Pin size={14} aria-hidden="true" />
            <span className="sr-only">{t("lab-direction-pinned")}</span>
          </span>
        ) : <span aria-hidden="true" />}
        <ChevronDown size={16} className={`${accent}${expanded ? " rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <p id={bodyId} hidden={!expanded} className="px-3 pb-3 pl-[1.625rem] text-[13px] leading-relaxed text-gray-600">
        {body}
      </p>
    </li>
  );
}

export default function LabOverview() {
  const { t, i18n } = useTranslation();
  const isChinese = i18n.language.startsWith("zh");

  return (
    <section id="research-directions" aria-labelledby="lab-overview-title" className="mt-8 scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-b border-gray-300 pb-2.5">
        <h2 id="lab-overview-title" aria-label={labName} className="min-w-0 text-2xl font-semibold">
          <span className="group relative inline-block max-w-full">
            <button
              type="button"
              aria-describedby="lab-name-hint"
              className="rounded-sm text-inherit hover:decoration-dotted hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
              onClick={(event) => event.currentTarget.focus()}
            >
              {labMark}
            </button>
            <span
              id="lab-name-hint"
              role="tooltip"
              lang={isChinese ? "zh" : "en"}
              className="pointer-events-none invisible absolute left-0 top-full z-10 mt-2 whitespace-nowrap rounded-sm bg-gray-900 px-2.5 py-1.5 text-[13px] font-normal text-white group-hover:visible group-focus-within:visible"
            >
              {t("lab-name-hint")}
            </span>
          </span>
          {labName.slice(labMark.length)}
        </h2>
        <Link
          to="/lab"
          className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-teal-800 hover:underline"
        >
          {t("lab-meet-people")}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <p className="mb-5 mt-3 text-[15px] leading-relaxed text-gray-700">{t("lab-summary", { labName })}</p>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {labBranches.map((branch) => {
          const isAlgo = branch.id === "algo";
          const Icon = isAlgo ? Network : BrainCircuit;
          const directions = isChinese ? branch.zhDirections : branch.directions;
          return (
            <section
              key={branch.id}
              aria-labelledby={`home-${branch.id}-title`}
              className={`min-w-0 border-t-2 pt-3 ${isAlgo ? "border-teal-600" : "border-orange-600"}`}
            >
              <h3 id={`home-${branch.id}-title`} className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900">
                <Icon size={17} className={isAlgo ? "text-teal-700" : "text-orange-700"} aria-hidden="true" />
                {isChinese ? branch.zhGroup : branch.group}
              </h3>
              <ul className="space-y-2">
                {directions.map(({ title, body }) => (
                  <ResearchDirection key={title} title={title} body={body} isAlgo={isAlgo} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
