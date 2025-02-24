import Image from 'next/image';
import GradientBackground from './components/GradientBackground';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="h-20 w-full flex justify-center items-center text-black text-2xl font-semibold gap-1">
        <Image src="/logo.svg" alt="Alice" width={32} height={32} />
        Alice
      </nav>
      <GradientBackground />
      <header className="flex justify-center items-center relative min-h-[600px] overflow-hidden">
        <div>
          <div className="text-white text-[80px] font-bold text-center">
            Alice
          </div>
          <div className="container mx-auto text-center">
            <p className="text-white/80 mb-4">
              The next blockchain AI agent future
            </p>
            <p className="text-white/60 mb-6">Coming soon</p>
            <div className="flex gap-4 justify-center">
              <button className="bg-black text-white px-6 py-2 rounded-lg">
                Search agent
              </button>
              <button className="bg-white text-black px-6 py-2 rounded-lg">
                Create agent
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative container mx-auto mt-[416px] mb-52">
        <h2 className="text-4xl text-black font-bold text-center mb-12">
          What is Alice?
        </h2>
        <div className="max-w-5xl mx-auto text-center text-gray-600 leading-relaxed">
          <Image
            className="absolute top-[-80px]"
            src="/leftQuote.svg"
            alt="quote"
            width={100}
            height={100}
          />
          <p className="text-lg">
            Alice is an AI Agent training and usage tool developed specifically
            for the blockchain field, aimed at helping users enhance the
            operational efficiency of blockchain projects through intelligent
            means. Users can interact with the AI Agent to train and deploy
            their own agents. Through the token incentive mechanism, users can
            obtain corresponding token rewards when their agents complete
            meaningful communication with the AI Agent, making blockchain
            operations easier and more efficient.
          </p>
          <Image
            className="absolute bottom-[-80px] right-0"
            src="/rightQuote.svg"
            alt="quote"
            width={100}
            height={100}
          />
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-black font-bold text-center mb-16">
            How Alice is going to help you?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-xl shadow-lg">
                <img
                  src={`/feature-${item}.png`}
                  alt={`Feature ${item}`}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Feature Title</h3>
                <p className="text-gray-600">
                  Feature description goes here...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 text-black">
          <h2 className="text-4xl font-bold text-center mb-16">
            Core Advantages
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-[#F8F8FB] px-8 h-[140px] rounded-xl">
              <h3 className="text-xl">Tokenization of AI Agents</h3>
              <span className="text-2xl font-bold">/01</span>
            </div>
            <div className="flex items-center justify-between px-8 h-[140px] bg-[#F8F8FB] rounded-xl">
              <h3 className="text-xl">On-chain operation automation</h3>
              <span className="text-2xl font-bold">/02</span>
            </div>
            <div className="flex items-center justify-between  px-8 h-[140px] bg-[#F8F8FB] rounded-xl">
              <h3 className="text-xl">
                The innovative integration of community, AI, and blockchain
              </h3>
              <span className="text-2xl font-bold">/03</span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center py-24">
        <Image src="/advantage.svg" alt="advantage" width={1192} height={411} />
      </section>

      <section className="py-24">
        <div className="container mx-auto py-12 px-6">
          <h1 className="text-4xl font-extrabold text-black mb-8">Roadmap</h1>

          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="/roadMapBg.svg"
              alt="advantage"
              width={1192}
              height={200}
              layout="responsive"
            />
            <h2 className="text-white text-5xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Testnet launch Stage
            </h2>
          </div>

          {/* 时间轴 */}
          <div className="flex justify-between mt-12 gap-4">
            <div className="flex flex-col justify-between w-[25%]">
              <div className="text-lg text-gray-600">2025.3.31</div>
              <div className="flex-grow h-1 bg-gradient-to-r from-purple-600 to-transparent w-full mb-6">
                <div className="w-1/3 h-full bg-purple-600"></div>
              </div>
              <div className="text-black">Testnet launch</div>
            </div>

            <div className="flex flex-col justify-between w-[25%]">
              <div className="text-lg text-[#808080]">2025.4.15</div>
              <div className="flex-grow h-1 bg-[#e8e8e8] w-full mb-6"></div>
              <div className="text-[#808080]">V1 official launch</div>
            </div>

            <div className="flex flex-col justify-between w-[25%]">
              <div className="text-lg text-[#808080]">2025.6.1</div>
              <div className="flex-grow h-1 bg-[#e8e8e8] w-full mb-6"></div>
              <div className="text-[#808080]">Token airdrop</div>
            </div>

            <div className="flex flex-col justify-between w-[25%]">
              <div className="text-lg text-[#808080]">Future</div>
              <div className="flex-grow h-1 bg-[#e8e8e8] w-full mb-6"></div>
              <div className="text-[#808080]">More Action</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex gap-2 justify-center items-center text-2xl font-bold">
              <Image src="/footerLogo.svg" alt="logo" width={48} height={48} />
              <div>Alice</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Contact us</h4>
            <a
              className="text-gray-400"
              href="mailto:alice_ai_2025@outlook.com"
            >
              Email: alice_ai_2025@outlook.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
