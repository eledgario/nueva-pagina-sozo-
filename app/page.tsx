import HeroVerticalChain from '@/components/HeroVerticalChain';
import VelocityMarquee from '@/components/VelocityMarquee';
import SolutionsGrid from '@/components/SolutionsGrid';
import TheLab from '@/components/TheLab';
import OrderProcess from '@/components/OrderProcess';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroVerticalChain />
      <VelocityMarquee text="MERCH QUE IMPACTA · SWAG CORPORATIVO · KITS ON-DEMAND · CDMX MX · " />
      <SolutionsGrid />
      <div id="lab"><TheLab /></div>
      <div id="process"><OrderProcess /></div>
      <div id="faq"><FAQ /></div>
      <Footer />
    </>
  );
}
