/* eslint-disable jsdoc/require-description */
import * as React from "react"

type Props = React.ComponentPropsWithoutRef<"button"> & {
  /**
   *
   */
  children: React.ReactChild | string[] | string
  /**
   *
   */
  className?: string
  /**
   *
   */
  disabled?: boolean
  /**
   *
   */
  onClick?: any
  /**
   *
   */
  type?: string
}

export default function Button({ className, ...rest }: Props) {
  return (
    <button
      className={`text-primary focus:border-gray-1000 flex flex-none items-center justify-center space-x-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-base font-medium hover:border-gray-300 focus:outline-none focus:ring-0 disabled:bg-opacity-0 disabled:opacity-50 dark:border-neutral-700 dark:bg-white dark:bg-opacity-10 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-600 ${className}`}
      {...rest}
    />
  )
}

/**
 * @param root0
 * @param root0.className
 */
export function LinkButton({ className, ...rest }: Props) {
  return (
    <button
      className={`flex flex-none items-center justify-center space-x-3 rounded border border-transparent bg-transparent px-4 py-1.5 font-medium text-neutral-700 hover:bg-neutral-200 hover:text-black focus:border-neutral-200 focus:outline-none focus:ring-0 disabled:bg-opacity-0 disabled:opacity-50 dark:bg-opacity-10 dark:text-neutral-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:border-gray-800 ${className}`}
      {...rest}
    />
  )
}
