// import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid"


export default function ClassSelect({ selectedClass, setSelectedClass }) {
  // put your real class list here
  const classes = ["All Classes", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"];

  return (
    <div className="w-30">
      <Listbox value={selectedClass} onChange={setSelectedClass}>
        <div className="relative">
          {/* Button (click to open) */}
          <Listbox.Button className="w-full px-2 py-1 border rounded-md text-left bg-white">
            {selectedClass || "All Classes"}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          {/* Dropdown list */}
          <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-md border bg-white shadow-md z-10">
            {classes.map((cls) => (
              <Listbox.Option
                key={cls}
                value={cls === "All Classes" ? "" : cls} // empty means no filter
                className="cursor-pointer px-2 py-1 hover:bg-gray-100"
              >
                {cls}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
