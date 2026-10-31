export function Redline({
  from,
  to,
  note,
}: {
  from: string
  to: string
  note?: string
}) {
  return (
    <>
      <del className="m-strike no-underline">{from}</del>{' '}
      <ins className="m-after-strike no-underline">{to}</ins>
      {note && (
        <span className="m-after-strike ml-3 font-mono text-[13px] text-red">
          {note}
        </span>
      )}
    </>
  )
}
