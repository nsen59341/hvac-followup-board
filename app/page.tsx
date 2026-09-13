import { logOutcome } from "./actions";
import {
  missingSetting,
  supabase,
  STAGES,
  SUPABASE_KEY_ENV,
  SUPABASE_URL_ENV,
  type FollowUp,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

const IST = "Asia/Kolkata";
const OUTCOMES = ["Call", "Message", "Booking"] as const;

function rupees(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: IST,
  }).format(new Date(iso));
}

function isOverdue(card: FollowUp): boolean {
  return card.stage !== "Booked" && new Date(card.follow_up_at).getTime() < Date.now();
}

/** State 1: a required setting is not there. Name it. */
function MissingSetting({ name }: { name: string }) {
  return (
    <main className="state">
      <div className="state-card state-card--setting">
        <span className="state-tag">Setup</span>
        <h1>A setting is missing</h1>
        <p>
          This app has not been given <code>{name}</code>. Add it to{" "}
          <code>.env.local</code> in the project root and restart the dev server.
        </p>
        <pre>{`# .env.local\n${name}=your value here`}</pre>
        <p>
          The other setting it needs is{" "}
          <code>{name === SUPABASE_URL_ENV ? SUPABASE_KEY_ENV : SUPABASE_URL_ENV}</code>.
        </p>
      </div>
    </main>
  );
}

/** State 2: the settings are there, but the request to Supabase failed. */
function FetchFailed({ message }: { message: string }) {
  const looksLikeMissingTable =
    /relation|does not exist|schema cache|could not find the table|permission denied/i.test(message);
  return (
    <main className="state">
      <div className="state-card state-card--error">
        <span className="state-tag">Connection</span>
        <h1>The call to Supabase failed</h1>
        <p>
          The settings are present, but the request did not come back with data. This is what the
          project said:
        </p>
        <pre>{message}</pre>
        {looksLikeMissingTable && (
          <p className="hint">
            That usually means the <code>follow_ups</code> table is not there yet. Run{" "}
            <code>supabase/schema.sql</code> in the Supabase SQL editor, then{" "}
            <code>supabase/seed.sql</code>, and refresh this page.
          </p>
        )}
      </div>
    </main>
  );
}

/** State 3: connected, but there is nothing in the table. */
function EmptyBoard() {
  return (
    <main className="state">
      <div className="state-card state-card--empty">
        <span className="state-tag">No data</span>
        <h1>The table is empty</h1>
        <p>
          Everything is connected — there are just no follow-ups yet. Run{" "}
          <code>supabase/seed.sql</code> to load the demo jobs, or add your own in the Supabase
          table editor.
        </p>
      </div>
    </main>
  );
}

function Card({ card }: { card: FollowUp }) {
  const overdue = isOverdue(card);
  const booked = card.stage === "Booked";
  const days = daysSince(card.last_contact_at);

  return (
    <article
      className={`card${overdue ? " card--overdue" : ""}${booked ? " card--booked" : ""}`}
    >
      <div className="card-top">
        <span className={`badge badge--${card.job_type.toLowerCase()}`}>{card.job_type}</span>
        {overdue && <span className="flag">Past follow-up</span>}
      </div>
      <h3>{card.customer_name}</h3>
      <p className="value">{rupees(card.job_value)}</p>
      <dl className="meta">
        <div>
          <dt>Last contact</dt>
          <dd>{days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}</dd>
        </div>
        <div>
          <dt>Follow up by</dt>
          <dd>{shortDate(card.follow_up_at)}</dd>
        </div>
      </dl>
      {card.notes && <p className="notes">{card.notes}</p>}
      {!booked && (
        <form className="actions" action={logOutcome}>
          <input type="hidden" name="id" value={card.id} />
          {OUTCOMES.map((kind) => (
            <button
              key={kind}
              type="submit"
              name="kind"
              value={kind}
              className={`btn btn--${kind.toLowerCase()}`}
            >
              Log {kind.toLowerCase()}
            </button>
          ))}
        </form>
      )}
    </article>
  );
}

function Board({ rows }: { rows: FollowUp[] }) {
  const open = rows.filter((r) => r.stage !== "Booked");
  const atRisk = open.reduce((sum, r) => sum + Number(r.job_value), 0);
  const overdueCount = open.filter(isOverdue).length;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">HVAC Follow-Up Board</p>
          <h1>Today&rsquo;s chase list</h1>
          <p className="sub">
            Every open quote and unconfirmed appointment, oldest follow-up first.
          </p>
        </div>
        <div className="risk">
          <span className="risk-label">Still at risk</span>
          <span className="risk-value">{rupees(atRisk)}</span>
          <span className="risk-meta">
            {open.length} open · {overdueCount} past follow-up
          </span>
        </div>
      </header>

      <section className="board">
        {STAGES.map((stage) => {
          const cards = rows.filter((r) => r.stage === stage);
          return (
            <div className="column" key={stage}>
              <div className="column-head">
                <h2>{stage}</h2>
                <span className="count">{cards.length}</span>
              </div>
              <div className="column-body">
                {cards.length === 0 ? (
                  <p className="column-empty">Nothing here.</p>
                ) : (
                  cards.map((card) => <Card key={card.id} card={card} />)
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default async function Page() {
  const missing = missingSetting();
  if (missing) return <MissingSetting name={missing} />;

  let rows: FollowUp[] = [];
  let errorMessage: string | null = null;

  try {
    const { data, error } = await supabase()
      .from("follow_ups")
      .select("*")
      .order("follow_up_at", { ascending: true });
    if (error) errorMessage = error.message;
    else rows = (data ?? []) as FollowUp[];
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e);
  }

  if (errorMessage) return <FetchFailed message={errorMessage} />;
  if (rows.length === 0) return <EmptyBoard />;
  return <Board rows={rows} />;
}
