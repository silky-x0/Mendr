export function Redline({
  from,
  to,
  note,
  multiline,
  fromLabel = 'was ',
  toLabel = 'now ',
}: {
  from: string
  to: string
  note?: string
  /** Old text may wrap: static line-through instead of the drawn ::after strike */
  multiline?: boolean
  fromLabel?: string
  toLabel?: string
}) {
  return (
    <>
      <del
        className={
          multiline
            ? 'm-del-static no-underline'
            : 'm-strike no-underline'
        }
      >
        <span className="sr-only">{fromLabel}</span>
        {from}
      </del>{' '}
      <ins className="m-after-strike no-underline">
        <span className="sr-only">{toLabel}</span>
        {to}
      </ins>
      {note && (
        <span className="m-after-strike block font-mono text-[13px] leading-6 text-red sm:ml-3 sm:inline">
          {note}
        </span>
      )}
    </>
  )
}
