import { useEffect, useState } from "react";
import { ArrowUpRight, BrainCircuit, ChevronDown, FileText, GraduationCap, Network } from "lucide-react";
import { useTranslation } from "react-i18next";
import labMastheadSmall from "../assets/tbd-lab-sky-960.jpg";
import labMasthead from "../assets/tbd-lab-sky-1920.jpg";
import labMastheadHighResolution from "../assets/tbd-lab-sky-2680.jpg";
import { labName } from "../features/lab/brand";
import { educationLabel, institutionName, labAlumni, labBranches, type LabBranchId, type LabPerson } from "../features/lab/data";
import { getManuscripts, getSelectedPublications, type ResearchWork } from "../features/publications/catalog";
import "../features/lab/lab.css";

const roles = {
  "Ph.D. Students": "lab-role-phd",
  "M.Phil. Students": "lab-role-mphil",
  "Research Assistants": "lab-role-ra",
} as const;

const awards: Record<string, { label: string; zh: string; tone: string }> = {
  "ICPC Gold": { label: "ICPC Regional Gold Medalist", zh: "ICPC 区域赛金牌", tone: "gold" },
  "ICPC Champion": { label: "ICPC Regional Champion", zh: "ICPC 区域赛冠军", tone: "gold" },
  "ICPC WF Finalist": { label: "ICPC World Finalist", zh: "ICPC 全球总决赛选手", tone: "finalist" },
  "ICPC WF 10th": { label: "ICPC World Final Bronze Medalist (10th)", zh: "ICPC 全球总决赛铜牌（第 10 名）", tone: "bronze" },
  "CCPC Champion": { label: "CCPC Regional Champion", zh: "CCPC 分站赛冠军", tone: "gold" },
  "CCSP Champion × 2": { label: "CCSP Two-Time Champion", zh: "CCSP 冠军 × 2", tone: "gold" },
  "NOI Silver": { label: "National Olympiad in Informatics Silver Medalist", zh: "全国青少年信息学奥林匹克竞赛 (NOI) 银牌", tone: "silver" },
  "NOI Bronze": { label: "National Olympiad in Informatics Bronze Medalist", zh: "全国青少年信息学奥林匹克竞赛 (NOI) 铜牌", tone: "bronze" },
};

function authorName(name: string) {
  return name.replace(/(?:\*| \((?:Co-first Author|Alphabetical Order)\))$/, "");
}

function hasAuthor(work: ResearchWork, person: string) {
  return work.authors.some(({ name }) => authorName(name) === person);
}

function ResearchList({ title, works, personName }: { title: string; works: ResearchWork[]; personName: string }) {
  if (works.length === 0) return null;

  return (
    <details className="lab-work-list">
      <summary>
        <FileText size={15} aria-hidden="true" />
        {title}
        <span className="lab-work-count">{works.length}</span>
        <span className="sr-only">: {personName}</span>
        <ChevronDown className="lab-work-chevron" size={16} aria-hidden="true" />
      </summary>
      <ol className="lab-works">
        {works.map((work) => (
          <li className="lab-work" key={work.title}>
            <p className="lab-work-title">{work.title}</p>
            <p className="lab-work-authors">
              {work.authors.map(({ name, href }, index) => (
                <span key={name}>
                  {authorName(name) === personName ? <strong>{name}</strong> : href && href !== "#" ? (
                    <a href={href} target="_blank" rel="noreferrer">{name}</a>
                  ) : name}
                  {index < work.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            {work.venue && <p className="lab-work-venue">{work.venue}</p>}
            {work.arXiv.length > 0 && (
              <div className="lab-work-links">
                {work.arXiv.map(({ name, href }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer">
                    {name} <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}

function MemberRow({ person, isChinese, papers, manuscripts, alumni = false }: {
  person: LabPerson;
  isChinese: boolean;
  papers: ResearchWork[];
  manuscripts: ResearchWork[];
  alumni?: boolean;
}) {
  const { t } = useTranslation();
  const primaryName = isChinese ? person.zhName : person.name;
  const alternateName = isChinese ? person.name : person.zhName;
  const affiliation = (isChinese ? person.zhAffiliationLabel : undefined)
    ?? person.affiliationLabel
    ?? `@ ${institutionName(person.affiliation, isChinese)}`;
  const coadvisor = (isChinese ? person.zhCoadvisor : undefined) ?? person.coadvisor;
  const personalPapers = papers.filter((work) => hasAuthor(work, person.name));
  const personalWorks = [...personalPapers, ...manuscripts.filter((work) => hasAuthor(work, person.name))];
  const paperBadges = personalPapers.flatMap((paper) => {
    if (!paper.venueLabel || !paper.coFirstAuthors?.includes(person.name)) return [];
    return t("lab-paper-cofirst", { venue: paper.venueLabel });
  });

  return (
    <li className="lab-person">
      <div className="lab-person-identity">
        <strong className="lab-person-name">{primaryName}</strong>
        <span className="lab-person-alternate" lang={isChinese ? "en" : "zh"}>{alternateName}</span>
        <p className="lab-person-period">{person.period}</p>
        {alumni && <p className="lab-person-role">{t("lab-former-ra")}</p>}
      </div>
      <div className="lab-person-details">
        {affiliation && (
          <p className={`lab-person-affiliation${alumni ? " lab-person-destination" : ""}`}>{affiliation}</p>
        )}
        {coadvisor && (
          <p className="lab-person-affiliation">{t("lab-coadvised", { advisor: coadvisor })}</p>
        )}
        {!!person.background?.length && (
          <ul className="lab-education">
            {person.background.map((degree) => (
              <li key={degree.join(":")}>{educationLabel(degree, isChinese)}</li>
            ))}
          </ul>
        )}
        {!!person.highlight?.length && (
          <ul className="lab-badges">
            {person.highlight.map((award) => {
              const info = awards[award];
              return (
                <li key={award} className={`lab-badge lab-award-${info?.tone ?? "gold"}`}>
                  {info ? (isChinese ? info.zh : info.label) : award}
                </li>
              );
            })}
          </ul>
        )}
        {paperBadges.length > 0 && (
          <ul className="lab-badges">
            {paperBadges.map((badge) => <li key={badge} className="lab-badge lab-award-paper">{badge}</li>)}
          </ul>
        )}
        <ResearchList title={t("lab-publications")} works={personalWorks} personName={person.name} />
      </div>
    </li>
  );
}

const filters = ["all", "alumni", "algo", "ai"] as const;

export default function Lab() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<LabBranchId | "all" | "alumni">("all");
  const isChinese = i18n.language.startsWith("zh");
  const quoteSource = isChinese
    ? "https://theory.people.com.cn/n1/2024/1217/c40764-40383872.html"
    : "https://www.rice.edu/kennedy";
  const pageTitle = `${labName} | ${t("site-title")}`;
  const visibleBranches = labBranches.filter(({ id }) => filter === "all" || id === filter);
  const showAlumni = filter === "all" || filter === "alumni";
  const papers = getSelectedPublications(t).flatMap((group) => group.publications);
  const manuscripts = getManuscripts(t).flatMap((group) => group.publications);
  const peopleCount = visibleBranches.reduce(
    (total, branch) => total + branch.sections.reduce((sum, section) => sum + section.people.length, 0),
    showAlumni ? labAlumni.length : 0,
  );
  const memberRows = (people: LabPerson[], alumni = false) => (
    <ul className="lab-person-list">
      {people.map((person) => (
        <MemberRow key={person.name} person={person} isChinese={isChinese} papers={papers} manuscripts={manuscripts} alumni={alumni} />
      ))}
    </ul>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = pageTitle;
    return () => { document.title = previousTitle; };
  }, [pageTitle]);

  return (
    <main className="lab-page">
      <header className="lab-masthead">
        <img
          className="lab-masthead-image"
          src={labMasthead}
          srcSet={`${labMastheadSmall} 960w, ${labMasthead} 1920w, ${labMastheadHighResolution} 2680w`}
          sizes="(max-width: 302px) 302px, 100vw"
          width={1920}
          height={1261}
          alt=""
        />
        <div className="lab-inner lab-masthead-content">
          <h1 lang="en">{labName}</h1>
        </div>
        <div className="lab-inner lab-masthead-footer">
          <p className="lab-art-credit">
            {t("lab-art-credit")}{" "}
            <a href="https://www.pixiv.net/users/13134696" target="_blank" rel="noreferrer">thkani</a>
            <span aria-hidden="true">{" · "}</span>
            <a href="https://www.pixiv.net/artworks/69000196" target="_blank" rel="noreferrer" title="空の色">
              {t("lab-art-source")}
            </a>
          </p>
          <figure className="lab-masthead-quote" lang={isChinese ? "zh" : "en"}>
            <blockquote cite={quoteSource}>{t("lab-masthead-quote")}</blockquote>
            <figcaption>{t("lab-masthead-quote-attribution")}</figcaption>
          </figure>
        </div>
      </header>

      <section className="lab-inner lab-directory" aria-labelledby="lab-people-title">
        <div className="lab-directory-bar">
          <div className="lab-directory-title">
            <h2 id="lab-people-title">{t("lab-people")}</h2>
            <span className="lab-people-count" aria-live="polite">{t("lab-people-count", { count: peopleCount })}</span>
          </div>
          <div className="lab-filters" role="group" aria-label={t("lab-filter-label")}>
            {filters.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {t(id === "all" ? "lab-all" : `lab-filter-${id}`)}
              </button>
            ))}
          </div>
        </div>

        {showAlumni && (
          <section className="lab-branch lab-branch-alumni" aria-labelledby="lab-alumni-title">
            <div className="lab-branch-header">
              <GraduationCap size={24} strokeWidth={1.75} aria-hidden="true" />
              <h3 id="lab-alumni-title">{t("lab-filter-alumni")}</h3>
            </div>
            {memberRows(labAlumni, true)}
          </section>
        )}

        {visibleBranches.map((branch) => {
          const isAlgo = branch.id === "algo";
          const Icon = isAlgo ? Network : BrainCircuit;
          return (
            <section
              key={branch.id}
              className={`lab-branch lab-branch-${branch.id}`}
              aria-labelledby={`lab-${branch.id}-title`}
            >
              <div className="lab-branch-header">
                <span className="lab-branch-index" aria-hidden="true">{isAlgo ? "01" : "02"}</span>
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                <h3 id={`lab-${branch.id}-title`}>{isChinese ? branch.zhGroup : branch.group}</h3>
              </div>
              {branch.sections.map((section) => (
                <div key={section.group} className="lab-cohort">
                  <h4>{t(roles[section.group])}</h4>
                  {memberRows(section.people)}
                </div>
              ))}
            </section>
          );
        })}
      </section>
    </main>
  );
}
