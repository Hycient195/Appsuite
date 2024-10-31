import { useAppDispatch } from "@/redux/hooks/hooks";
import sharedSlice from "@/redux/slices/shared.slice";
import { CloseIcon } from "@/sharedComponents/CustomIcons";
import { useCallback } from "react";

export default function NotificationModal() {
  const dispatch = useAppDispatch();
  const closeModal = useCallback(() => dispatch(sharedSlice.actions.hideNotificationModal()), [dispatch]);

  return (
    <section onClick={(e) => e.stopPropagation()} className="p-4 animate-screen-slide-in-righ animate-slide-in-right rounded-lg lg:rounded-xl grid grid-rows-[max-content_max-content_max-content_1fr] gap-3 bg-white md:max-w-lg h-full">
      <div className="relative">
        <button onClick={closeModal} className="bg-white p-1 absolute right-0 top-0"><CloseIcon /></button>
        <h2 className="text-lg lg:text-xl text-zinc-700">Notifications</h2>
        <p className="font-light text-zinc-400 text-sm mt-1">Stay updated with your latest notification</p>
      </div>

      <div className="-mx-4 px-4 py-3 border-y border-y-zinc-200 flex flex-row justify-between items-center gap-3">
        <span className="text-zinc-700">Add</span>
        <span className="text-zinc-400 mr-auto">Unread</span>
        <span className="text-green-500 font-light text-sm flex flex-row items-center gap-1">{doubleTick} Mark all as read</span>
      </div>

      <h4 className="font-medium text-zinc-700">Today</h4>

      <div className="grid grid-rows-[max-content_1fr] gap-2 overflow-y-scroll no-scrollbar lg:gap-3">
        
        <div className="wrapper grid h-full bg-tes">
          <ul className="h-max flex flex-col gap-5">
            {
              Array.from({ length: 15 }).map((_, index) => (
                <li key={`app-notification-item-${index}`} className="grid grid-cols-[70px_1fr_max-content] items-center gap-2">
                  <figure className="w-full h-auto aspect-square rounded lg:rounded-md bg-zinc-100 overflow-hidden">
                    {/* <img src="" alt="" className="object-cover h-full w-full object-center" /> */}
                  </figure>
                  <div className="">
                    <p className="text-zinc-700 line-clamp-1 text-ellipsis">Coming soon</p>
                    <p className="text-zinc-400 font-light text-sm">July 16, 2024 | 09:00 PM</p>
                  </div>
                  <div className="mb-auto">
                    <div className="rounded-full h-2.5 w-2.5 bg-customRed" />
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </section>
  )
}

const doubleTick = <svg width="23" height="11" viewBox="0 0 23 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 4.53649L6.12626 9.66275L15.3535 0.435486" stroke="#19A902" strokeWidth="0.887097"/>
<path d="M9.20215 6.24524L12.6197 9.66275L21.8469 0.435486" stroke="#19A902" strokeWidth="0.887097"/>
</svg>
