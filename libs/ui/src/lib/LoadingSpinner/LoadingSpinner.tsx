export function LoadingSpinner() {
  return (
    <div className="inline-block relative w-20 h-20">
      <div className="absolute top-[33.33333px] w-[13.33333px] h-[13.33333px] rounded-full bg-gray-300 left-2 animate-lds-ellipsis1 [animation-timing-function:cubic-bezier(0,1,1,0)]"></div>
      <div className="absolute top-[33.33333px] w-[13.33333px] h-[13.33333px] rounded-full bg-gray-300 left-2 animate-lds-ellipsis2 [animation-timing-function:cubic-bezier(0,1,1,0)]"></div>
      <div className="absolute top-[33.33333px] w-[13.33333px] h-[13.33333px] rounded-full bg-gray-300 left-8 animate-lds-ellipsis2 [animation-timing-function:cubic-bezier(0,1,1,0)]"></div>
      <div className="absolute top-[33.33333px] w-[13.33333px] h-[13.33333px] rounded-full bg-gray-300 left-14 animate-lds-ellipsis3 [animation-timing-function:cubic-bezier(0,1,1,0)]"></div>
    </div>
  );
}
