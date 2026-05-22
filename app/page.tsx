import HeroVerticalChain from '@/components/HeroVerticalChain';
import TrustMarquee from '@/components/TrustMarquee';
import VelocityMarquee from '@/components/VelocityMarquee';
import SolutionsGrid from '@/components/SolutionsGrid';
import TheDrops from '@/components/TheDrops';
import TheArsenal from '@/components/TheArsenal';
import TheLab from '@/components/TheLab';
import OrderProcess from '@/components/OrderProcess';
import ProjectConfigurator from '@/components/ProjectConfigurator';
import Impresion3D from '@/components/Impresion3D';
import CatalogoCTA from '@/components/CatalogoCTA';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroVerticalChain />
      <TrustMarquee />
      <VelocityMarquee text="MERCH QUE IMPACTA · SWAG CORPORATIVO · KITS ON-DEMAND · CDMX MX · " />
      <SolutionsGrid />
      <div id="drops"><TheDrops /></div>
      <div id="arsenal"><TheArsenal /></div>
      <div id="lab"><TheLab /></div>
      <div id="process"><OrderProcess /></div>
      <div id="configurator"><ProjectConfigurator /></div>
      <Impresion3D />
      <CatalogoCTA />
      <div id="faq"><FAQ /></div>
      <Footer />
    </>
  );
}
