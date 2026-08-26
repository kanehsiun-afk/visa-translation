"use client";

import type { DocumentDefinition, Values, Members } from "@/lib/types";
import { buildRenderModel } from "@/lib/render-model";
import type {
  RenderModel,
  RenderRow,
  RenderSection,
  HukoubenBundle,
  HukoubenCard,
} from "@/lib/render-model";
import { PDF_DISCLAIMER_EN } from "@/lib/privacy";

interface PaperCanvasProps {
  def: DocumentDefinition;
  values: Values;
  members: Members;
}

function FieldTable({ rows }: { rows: RenderRow[] }) {
  return (
    <table className="w-full border-collapse text-[10px] leading-snug">
      <thead>
        <tr className="text-left text-ink-3">
          <th className="w-[34%] border border-line px-1.5 py-1 font-medium">Field</th>
          <th className="w-[36%] border border-line px-1.5 py-1 font-medium">English Translation</th>
          <th className="w-[30%] border border-line px-1.5 py-1 font-medium">中文（原件）</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td className="border border-line px-1.5 py-1 align-top font-medium text-ink">
              {row.label}
            </td>
            <td className="border border-line px-1.5 py-1 align-top text-ink">{row.value}</td>
            <td className="border border-line px-1.5 py-1 align-top text-ink-2">{row.original}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SectionBlock({ section }: { section: RenderSection }) {
  return (
    <div className="mb-2.5">
      <h3 className="mb-1 text-[11.5px] font-semibold text-ink">{section.title}</h3>
      <FieldTable rows={section.rows} />
    </div>
  );
}

function MemberCard({ heading, sections }: { heading: string; sections: RenderSection[] }) {
  return (
    <div className="mb-2.5">
      <h3 className="mb-1 border-b border-line pb-0.5 text-[11.5px] font-semibold text-ink">
        {heading}
      </h3>
      {sections.map((s) => (
        <div key={s.title} className="mb-1.5">
          <h4 className="mb-0.5 text-[10px] font-semibold text-ink-2">{s.title}</h4>
          <FieldTable rows={s.rows} />
        </div>
      ))}
    </div>
  );
}

/**
 * 中国户口本「户主页」固定画布。
 * 坐标按用户提供的 670 × 837 参考图逐区校准，禁止内容自适应撑高。
 * 未填字段在预览里以空白呈现（不加 XXX/— 占位），由用户自行对照表头填入。
 */
function HukoubenHeadPage({ h }: { h: HukoubenBundle }) {
  const serif = '"Times New Roman", Times, serif';
  const isEmpty = (v: string | undefined) => !v || v.trim() === "" || v === "—";

  // 户主页 4 个值的字段名占位（未填时浅灰显示，提示该位置要填的语义，便于用户比对）。
  const placeholders = ["type of household", "name", "household no.", "address"];

  return (
    <div
      className="relative bg-white text-black shadow-md"
      style={{ width: 670, height: 837, fontFamily: serif }}
    >
      {/* 整页外框：参考图 x=22, y=9, w=628, h=819 */}
      <div className="absolute border-2 border-black" style={{ left: 22, top: 9, width: 628, height: 819 }} />

      {/* Attention 区：固定高度至 y=389 */}
      <section
        className="absolute border-b border-black"
        style={{ left: 23, top: 10, width: 626, height: 379 }}
      >
        <h3
          className="absolute left-0 right-0 text-center font-bold"
          style={{ top: 36, fontSize: 14, lineHeight: "18px" }}
        >
          Attention
        </h3>
        <ol
          className="absolute m-0 list-decimal p-0"
          style={{ left: 31, right: 16, top: 65, fontSize: 13.3, lineHeight: "20.5px" }}
        >
          {h.notes.map((note, index) => (
            <li key={index} style={{ paddingLeft: 2 }}>
              {note}
            </li>
          ))}
        </ol>
      </section>

      {/* 户主页内框：参考图 x=35, y=430, w=602, h=374 */}
      <section
        className="absolute border border-black"
        style={{ left: 35, top: 430, width: 602, height: 374 }}
      >
        {/* 第一行：5 个单元格，末格为空 */}
        <div
          className="grid border-b border-black"
          style={{ height: 46, gridTemplateColumns: "116px 170px 107px 108px 1fr" }}
        >
          <HukouFixedCell borderRight>
            Type of Household
          </HukouFixedCell>
          <HukouFixedCell
            borderRight
            placeholder={placeholders[0]}
            empty={isEmpty(h.headRows[0]?.value)}
          >
            {h.headRows[0]?.value}
          </HukouFixedCell>
          <HukouFixedCell borderRight>
            Name of Householder
          </HukouFixedCell>
          <HukouFixedCell
            borderRight
            placeholder={placeholders[1]}
            empty={isEmpty(h.headRows[1]?.value)}
          >
            {h.headRows[1]?.value}
          </HukouFixedCell>
          <HukouFixedCell />
        </div>

        {/* 第二行：4 个单元格，不同列宽 */}
        <div
          className="grid border-b border-black"
          style={{ height: 43, gridTemplateColumns: "116px 104px 81px 1fr" }}
        >
          <HukouFixedCell borderRight>
            Household No.
          </HukouFixedCell>
          <HukouFixedCell
            borderRight
            placeholder={placeholders[2]}
            empty={isEmpty(h.headRows[2]?.value)}
          >
            {h.headRows[2]?.value}
          </HukouFixedCell>
          <HukouFixedCell borderRight>
            Address
          </HukouFixedCell>
          <HukouFixedCell
            placeholder={placeholders[3]}
            empty={isEmpty(h.headRows[3]?.value)}
          >
            {h.headRows[3]?.value}
          </HukouFixedCell>
        </div>

        {/* 底部签发日期行：未填字段显示灰色占位文字 */}
        <div
          className="flex items-center justify-end px-[7px]"
          style={{
            height: 41,
            borderTop: "1px dashed #8db4e2",
            fontSize: 13.2,
            lineHeight: "16px",
          }}
        >
          <span>
            <span className="text-black">Issued on: </span>
            {isEmpty(h.issueDateText) ? (
              <span className="text-[#c9c9c9]">date</span>
            ) : (
              <span className="text-black">{h.issueDateText}</span>
            )}
          </span>
        </div>
      </section>
    </div>
  );
}

function HukouFixedCell({
  children,
  borderRight = false,
  empty = false,
  placeholder,
}: {
  children?: React.ReactNode;
  borderRight?: boolean;
  empty?: boolean;
  /** 未填时显示的浅灰占位文字（如 "name"）。 */
  placeholder?: string;
}) {
  // 单元格内文字始终保持同一字号/同一字体；空态显示浅灰占位文字，填了实值时是黑色实值。
  const display = empty
    ? placeholder ?? ""
    : children ?? "";
  return (
    <div
      className={`flex items-center justify-center px-2 text-center ${borderRight ? "border-r border-black" : ""}`}
      style={{
        fontSize: 13.2,
        lineHeight: "17px",
        color: empty ? "#c9c9c9" : "#000",
      }}
    >
      {display}
    </div>
  );
}

/** 单个常住人口登记卡：黑色边框 + 顶部大字姓名 + 字段表。 */
function HukoubenCardBlock({ card }: { card: HukoubenCard }) {
  return (
    <div className="mt-4 border border-black">
      <div className="border-b border-black px-2 py-1 text-center text-[11px] font-semibold text-ink">
        {card.heading}
      </div>
      <div className="border-b border-black px-3 py-2">
        <div className="text-[16px] font-bold leading-tight text-ink">{card.nameEn}</div>
        <div className="text-[10px] text-ink-2">{card.nameZh}</div>
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {card.rows.map((row, i) => (
            <tr key={i} className="border-t border-black">
              <td className="w-[32%] border-r border-black px-2 py-1 align-top text-[9.5px] font-medium text-ink">
                {row.label}
              </td>
              <td className="px-2 py-1 align-top text-[9.5px] text-ink">
                {row.value}
                <div className="mt-0.5 text-[8px] text-ink-2">{row.original}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 中国户口本实物外观（HTML）：户主页独占第一页，成员登记卡各自另起纸张。 */
function HukoubenPaper({ model }: { model: RenderModel }) {
  const h: HukoubenBundle = model.hukouben!;
  return (
    <div className="space-y-6">
      <HukoubenHeadPage h={h} />
      {h.cards.map((card) => (
        <div
          key={card.heading}
          className="bg-white p-[35px] shadow-md"
          style={{ width: 670, minHeight: 837, fontFamily: '"Times New Roman", Times, serif' }}
        >
          <HukoubenCardBlock card={card} />
        </div>
      ))}
    </div>
  );
}

/** A4 纸张（HTML 预览，与 PDF 同源数据）。 */
function Paper({ model }: { model: RenderModel }) {
  if (model.renderStyle === "hukouben") {
    return (
      <div>
        <HukoubenPaper model={model} />
      </div>
    );
  }
  const isGenerated = model.kind === "generated";

  return (
    <div
      className="bg-white shadow-md"
      style={{ width: 794, minHeight: 1123 }}
    >
      <div className="px-[76px] py-[76px]">
        {isGenerated ? (
          <div className="text-[10px] leading-relaxed text-ink">
            <h2 className="mb-2 text-center text-[20px] font-bold text-ink">{model.title}</h2>
            <div className="mb-4 h-px bg-line" />
            {model.issueDate && model.issueDate !== "—" && (
              <p className="mb-3 text-right text-ink">Date: {model.issueDate}</p>
            )}
            <p className="mb-3">To Whom It May Concern,</p>
            {model.body
              ?.split(/\n{2,}/)
              .filter((p) => p.trim())
              .map((p, i) => (
                <p key={i} className="mb-3 whitespace-pre-wrap">
                  {p.trim()}
                </p>
              ))}
            <p className="mb-3">Yours faithfully,</p>
            <div className="mt-12 space-y-0.5">
              {model.signName && <p className="font-bold">{model.signName}</p>}
              {model.signPosition && <p>{model.signPosition}</p>}
              {model.signCompany && <p className="text-ink-2">{model.signCompany}</p>}
            </div>
          </div>
        ) : (
          <div className="text-[10px] leading-relaxed text-ink">
            <p className="mb-1 text-[7.5px] uppercase tracking-[1.6px] text-ink-3">
              ENGLISH TRANSLATION
            </p>
            <div className="mb-2 h-px bg-line" />
            <h2 className="text-[20px] font-bold text-ink">{model.title}</h2>
            {model.subtitle && <p className="mt-0.5 text-[10.5px] text-ink-2">{model.subtitle}</p>}
            {model.note && <p className="mt-1 text-[8.5px] leading-snug text-ink-3">{model.note}</p>}

            <div className="mt-3">
              {model.topSections.map((s) => (
                <SectionBlock key={s.title} section={s} />
              ))}
              {model.memberCards.map((m) => (
                <MemberCard key={m.heading} heading={m.heading} sections={m.sections} />
              ))}
            </div>

            <div className="mt-4 border-t border-line pt-1.5 text-[7.5px] leading-relaxed text-ink-3">
              {PDF_DISCLAIMER_EN.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** 公开的可复用「A4 预览画布」组件：右侧预览固定为默认大小（无缩放控件）。 */
export function PaperCanvas({ def, values, members }: PaperCanvasProps) {
  const model = buildRenderModel(def, values, members);

  return (
    <div className="overflow-auto rounded-xl border border-line bg-[#e9e9e6] p-4 sm:p-6">
      <div className="mx-auto w-fit">
        <Paper model={model} />
      </div>
    </div>
  );
}