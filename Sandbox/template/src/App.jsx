import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center" className="flex flex-col gap-[25px] justify-center items-center grow max-lg:pt-8 max-lg:pb-6 max-lg:px-5 max-lg:gap-[18px]">
        <div className="hero relative w-full h-[179px] max-lg:h-[150px]">
          <img src={heroImg} className="base w-[170px] relative z-0 mx-auto left-0 right-0" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework absolute z-[1] top-[34px] h-[28px] left-0 right-0 mx-auto transform-[perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]" alt="React logo" />
          <img src={viteLogo} className="vite absolute z-0 top-[107px] h-[26px] w-auto left-0 right-0 mx-auto transform-[perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]" alt="Vite logo" />
        </div>
        <div className="text-center">
          <h1 className="font-sans font-medium text-text-h text-[56px] tracking-[-1.68px] my-8 max-lg:text-[36px] max-lg:my-5">Get started</h1>
          <p className="m-0 text-text-main text-[18px] max-lg:text-[16px]">
            Edit <code className="font-mono inline-flex rounded-[4px] text-text-h text-[15px] leading-[135%] px-2 py-1 bg-code-bg">src/App.jsx</code> and save to test <code className="font-mono inline-flex rounded-[4px] text-text-h text-[15px] leading-[135%] px-2 py-1 bg-code-bg">HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter font-mono inline-flex items-center text-[16px] px-[10px] py-[5px] rounded-[5px] text-accent-main bg-accent-bg border-2 border-transparent transition-[border-color] duration-300 mb-6 hover:border-accent-border focus-visible:outline-2 focus-visible:outline-accent-main focus-visible:outline-offset-2 cursor-pointer"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks relative w-full before:content-[''] before:absolute before:top-[-4.5px] before:border-[5px] before:border-transparent before:left-0 before:border-l-border-main after:content-[''] after:absolute after:top-[-4.5px] after:border-[5px] after:border-transparent after:right-0 after:border-r-border-main"></div>

      <section id="next-steps" className="flex border-t border-border-main text-left max-lg:flex-col max-lg:text-center">
        <div id="docs" className="flex-1 p-8 max-lg:py-6 max-lg:px-5 border-r border-border-main max-lg:border-r-0 max-lg:border-b max-lg:border-border-main">
          <svg className="icon mb-4 w-[22px] h-[22px] max-lg:mx-auto text-text-main" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 className="font-sans font-medium text-text-h text-[24px] leading-[118%] tracking-[-0.24px] mb-2 max-lg:text-[20px]">Documentation</h2>
          <p className="m-0 text-text-main text-[18px] max-lg:text-[16px]">Your questions, answered</p>
          <ul className="list-none p-0 flex gap-2 mt-8 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a href="https://vite.dev/" target="_blank" className="text-text-h text-[16px] rounded-[6px] bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center max-lg:box-border">
                <img className="logo h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a href="https://react.dev/" target="_blank" className="text-text-h text-[16px] rounded-[6px] bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center max-lg:box-border">
                <img className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social" className="flex-1 p-8 max-lg:py-6 max-lg:px-5">
          <svg className="icon mb-4 w-[22px] h-[22px] max-lg:mx-auto text-text-main" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 className="font-sans font-medium text-text-h text-[24px] leading-[118%] tracking-[-0.24px] mb-2 max-lg:text-[20px]">Connect with us</h2>
          <p className="m-0 text-text-main text-[18px] max-lg:text-[16px]">Join the Vite community</p>
          <ul className="list-none p-0 flex gap-2 mt-8 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a href="https://github.com/vitejs/vite" target="_blank" className="text-text-h text-[16px] rounded-[6px] bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center max-lg:box-border">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a href="https://chat.vite.dev/" target="_blank" className="text-text-h text-[16px] rounded-[6px] bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center max-lg:box-border">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a href="https://x.com/vite_js" target="_blank" className="text-text-h text-[16px] rounded-[6px] bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center max-lg:box-border">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a href="https://bsky.app/profile/vite.dev" target="_blank" className="text-text-h text-[16px] rounded-[6px] bg-social-bg flex px-3 py-1.5 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-custom max-lg:w-full max-lg:justify-center max-lg:box-border">
                <svg
                  className="button-icon h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks relative w-full before:content-[''] before:absolute before:top-[-4.5px] before:border-[5px] before:border-transparent before:left-0 before:border-l-border-main after:content-[''] after:absolute after:top-[-4.5px] after:border-[5px] after:border-transparent after:right-0 after:border-r-border-main"></div>
      <section id="spacer" className="h-[88px] border-t border-border-main max-lg:h-[48px]"></section>
    </>
  )
}

export default App
