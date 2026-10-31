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
        <span className="m-after-strike ml-3 font-mono text-[13px] text-red">
          {note}
        </span>
      )}
    </>
  )
}
