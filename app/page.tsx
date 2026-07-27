import HeroVerticalChain from '@/components/HeroVerticalChain';
import VelocityMarquee from '@/components/VelocityMarquee';
import SolutionsGrid from '@/components/SolutionsGrid';
import TheLab from '@/components/TheLab';
import Impresion3D from '@/components/Impresion3D';
import OrderProcess from '@/components/OrderProcess';
import Showroom from '@/components/Showroom';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroVerticalChain />
      <VelocityMarquee text="MERCH QUE IMPACTA · SWAG CORPORATIVO · KITS ON-DEMAND · CDMX MX · " />
      <SolutionsGrid />
      <div id="lab"><TheLab /></div>
      <Impresion3D />
      <div id="process"><OrderProcess /></div>
      <Showroom />
      <div id="faq"><FAQ /></div>
      <Footer />
    </>
  );
}
