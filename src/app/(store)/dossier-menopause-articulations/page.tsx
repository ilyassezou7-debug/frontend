"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DossierMenopauseArticulationsPage() {
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const trigger = document.getElementById("naylo-cta-trigger");
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        setShowFloatingCta(rect.top < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productUrl = "/products/complement-menopause-equilibre-confiance";

  return (
    <div className="naylo-adv min-h-screen bg-[#FBF8F1] text-[#33332C] font-sans antialiased text-[18px] leading-[1.75]">
      <style jsx global>{`
        .naylo-adv {
          --green: #1c3a2a;
          --green2: #2e5240;
          --sage: #9fb8a4;
          --sage-bg: #eef3ec;
          --cream: #fbf8f1;
          --ink: #33332c;
          --muted: #6b6b61;
          --terra: #c0876b;
          --line: #e4e0d4;
        }
        .naylo-adv h1 {
          font-family: ui-serif, Georgia, "Times New Roman", serif;
          color: var(--green);
        }
        .naylo-adv .dek {
          font-family: ui-serif, Georgia, "Times New Roman", serif;
        }
        .naylo-adv .pq {
          font-family: ui-serif, Georgia, "Times New Roman", serif;
        }
      `}</style>

      {/* Top Bar */}
      <div className="bg-[#1C3A2A] text-[#F5F1E8] text-center text-[15px] font-extrabold tracking-[0.02em] py-3 px-4">
        Magazine Santé &amp; Bien-être™
      </div>

      <article className="max-w-[740px] mx-auto px-5 pt-[34px] pb-[60px]">
        {/* Main Title */}
        <h1 className="text-[32px] md:text-[40px] font-bold leading-[1.18] mb-[18px]">
          Votre hanche vous brûle la nuit ? Ce n&apos;est pas l&apos;âge — c&apos;est un organe dont personne ne vous parle.
        </h1>

        {/* Subhead / Dek */}
        <p className="dek text-[19px] md:text-[22px] leading-[1.4] text-[#2E5240] italic mb-[22px]">
          Voici comment des femmes retrouvent du confort en quelques semaines — sans collagène, sans infiltration, sans ibuprofène. Parce que le vrai problème n&apos;est pas vos articulations : c&apos;est vos hormones.
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#C0876B] tracking-[2px] font-bold">★★★★★</span>
          <span className="text-[14px] text-[#6B6B61] font-bold">4,8/5 · plus de 4 000 avis vérifiés</span>
        </div>

        {/* Hero Image */}
        <figure className="my-6">
          <img
            src="/images/naylo/bed.png"
            alt="Femme assise au bord du lit le matin, la main au bas du dos"
            className="w-full h-auto rounded-[14px] shadow-sm"
          />
        </figure>

        {/* Author Byline */}
        <div className="flex items-center gap-3.5 my-4 text-[14.5px] text-[#6B6B61] pb-3 border-b border-[#E4E0D4]">
          <img
            src="/images/naylo/helene.png"
            alt="Hélène Vasseur"
            className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0 border border-[#9FB8A4]"
          />
          <div>
            Par <strong className="text-[#1C3A2A]">Hélène Vasseur</strong>, naturopathe (collaboration rémunérée Naylo) · spécialisée dans l&apos;accompagnement des femmes en (péri)ménopause
            <br />
            <span className="text-[13.5px] text-[#6B6B61]">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2E9E5B] text-white text-[10px] font-extrabold mr-1 align-[-2px]">✓</span>
              Publié le 11 juin 2026 · 6 min de lecture
            </span>
          </div>
        </div>

        {/* Vu sur Logos */}
        <div className="text-center my-6">
          <span className="block font-extrabold tracking-[0.12em] uppercase text-[12px] text-[#6B6B61] mb-3">Vu sur :</span>
          <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
            <img src="/images/naylo/presse_france2.png" alt="France 2" className="h-6 md:h-7 object-contain opacity-85" />
            <img src="/images/naylo/presse_sante.png" alt="Santé Magazine" className="h-6 md:h-7 object-contain opacity-85" />
            <img src="/images/naylo/presse_doctissimo.png" alt="Doctissimo" className="h-6 md:h-7 object-contain opacity-85" />
            <img src="/images/naylo/presse_sciences.png" alt="Sciences et Avenir" className="h-6 md:h-7 object-contain opacity-85" />
          </div>
        </div>

        {/* Story Intro */}
        <p className="mb-4">
          Il est 3 h du matin. Françoise est réveillée. Encore. Son mari dort à côté d&apos;elle, le souffle calme. Elle, non. C&apos;est sa <strong>hanche</strong>. Dès qu&apos;elle s&apos;allonge sur le côté, ça <strong>brûle</strong>. Une brûlure sourde, qui descend dans la cuisse. Elle se tourne sur le dos. Puis sur l&apos;autre côté. Rien à faire. Elle a glissé un coussin entre ses genoux, comme toutes les nuits. Et elle attend que le jour se lève, les yeux ouverts dans le noir, seule.
        </p>

        <p className="dek text-[22px] md:text-[25px] text-[#1C3A2A] italic mb-4">
          Et puis il faut se lever.
        </p>

        <p className="mb-4">
          Quand elle prend appui pour se redresser, sa hanche se <strong>bloque net</strong>. Une décharge. Le souffle coupé. Elle reste figée, une main sur le matelas. Il lui faut de longues minutes, ce matin encore, pour « déverrouiller » ce corps rouillé qui refuse de lui obéir. Puis elle rejoint la cuisine à petits pas, en se tenant aux meubles. Les escaliers ? Elle les descend de côté maintenant. Une marche à la fois. La main serrée sur la rampe.
        </p>

        <p className="mb-4">
          Dans le miroir, la même phrase, chaque matin : <em>« Je ne me reconnais plus. »</em> Françoise a 58 ans. Elle s&apos;en sent 80.
        </p>

        <p className="mb-4">
          Si vous lisez ces lignes, vous connaissez cette scène par cœur. La hanche qui brûle la nuit, dès qu&apos;on se couche dessus. Le coussin entre les genoux. Les escaliers descendus de côté. La grimace qu&apos;on cache en se relevant d&apos;une chaise. Le kiné qui soulage une heure, puis la douleur qui revient. Et cette petite voix, de plus en plus forte : <strong>« C&apos;est l&apos;âge. C&apos;est fini. Tu ne redeviendras jamais comme avant. »</strong>
        </p>

        <p className="font-bold text-[#1C3A2A] mb-6">
          Cette voix se trompe. Vos douleurs de hanche après la ménopause ne sont pas un problème d&apos;articulation. C&apos;est un problème d&apos;œstrogène. Et dans les minutes qui suivent, vous allez comprendre exactement pourquoi — et pourquoi rien de ce que vous avez essayé n&apos;a pu marcher.
        </p>

        {/* Section 1 */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Ce que la douleur lui avait déjà volé
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/night.png"
            alt="Femme éveillée la nuit, ne peut pas dormir à cause de sa hanche"
            className="w-full h-auto rounded-[14px]"
          />
        </figure>

        <p className="mb-4">
          En trois ans, Françoise n&apos;avait pas seulement perdu sa souplesse. Elle avait perdu des morceaux d&apos;elle-même, un par un.
        </p>

        <p className="mb-4">
          La randonnée du dimanche avec son mari : <strong>finie</strong>. Le jardin, sa fierté, qu&apos;elle ne peut plus faire à genoux. Les nuits entières, parce qu&apos;elle ne peut plus dormir sur le côté sans que la hanche la réveille. Les dîners entre amies qu&apos;elle annule, parce que rester assise deux heures est devenu une torture. Et même tendre la main pour un bocal en haut du placard — un geste qu&apos;elle ne fait plus. Elle le tend à son mari, sans un mot. Par honte.
        </p>

        <p className="mb-3">Le pire, me confiait-elle, ce n&apos;était même pas la douleur. C&apos;était ceci :</p>

        <blockquote className="pq text-[22px] md:text-[26px] text-[#1C3A2A] italic border-l-[3px] border-[#C0876B] pl-5 my-6 leading-[1.3]">
          « J&apos;ai l&apos;impression que mon corps me trahit. Que je deviens vieille avant l&apos;heure — et que je n&apos;y peux rien. »
        </blockquote>

        <div id="naylo-cta-trigger" />

        <p className="mb-4">
          Elle ne se reconnaissait plus. La femme active, solide, celle « sur qui on pouvait compter », disparaissait un peu plus chaque mois. Et personne, autour d&apos;elle, ne comprenait vraiment.
        </p>

        {/* Section 2 */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Le jour où elle a failli renoncer
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/sad.png"
            alt="Femme découragée le soir, au bord des larmes"
            className="w-full h-auto rounded-[14px]"
          />
        </figure>

        <p className="mb-4">
          Il y a un moment dont Françoise n&apos;aime pas parler. Un dimanche après-midi, sa petite-fille de quatre ans a levé les bras vers elle : <em>« Mamie, porte-moi ! »</em>
        </p>

        <p className="mb-4">
          Et Françoise n&apos;a pas pu. Le geste a commencé… puis s&apos;est arrêté net. Sa hanche s&apos;est dérobée. Elle a dû dire non à ce petit corps qui ne demandait qu&apos;un câlin. La petite n&apos;a pas compris pourquoi Mamie avait soudain les larmes aux yeux. Françoise, elle, est allée pleurer dans la salle de bain. Sans bruit. Pour que personne ne la voie.
        </p>

        <p className="mb-3">
          Ce soir-là, allongée, cherchant en vain une position où sa hanche ne la lançait pas, une pensée l&apos;a traversée. Celle qui fait le plus mal de toutes :
        </p>

        <blockquote className="pq text-[22px] md:text-[26px] text-[#1C3A2A] italic border-l-[3px] border-[#C0876B] pl-5 my-6 leading-[1.3]">
          « Est-ce que c&apos;est ça, le reste de ma vie ? Est-ce que je dois juste… m&apos;y faire ? »
        </blockquote>

        <p className="mb-6">
          Si cette question vous a déjà traversée, ne serait-ce qu&apos;une fois — restez avec moi jusqu&apos;au bout. Parce que la réponse est <strong>non</strong>. Et Françoise en est aujourd&apos;hui la preuve vivante.
        </p>

        {/* Section 3 */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Trois ans à chercher au mauvais endroit
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/etagere.png"
            alt="Étagère encombrée de produits essayés"
            className="w-full h-auto rounded-[14px]"
          />
          <figcaption className="text-[13.5px] text-[#6B6B61] text-center mt-2 italic">
            Comme tant d&apos;autres femmes, Françoise avait accumulé les boîtes — sans jamais toucher la vraie cause.
          </figcaption>
        </figure>

        <p className="mb-4">
          Avant d&apos;arriver dans mon cabinet, Françoise avait fait ce que font la plupart des femmes : elle avait cherché de l&apos;aide partout. Cinq médecins en trois ans. Et presque toujours, la même phrase :
        </p>

        <blockquote className="pq text-[22px] md:text-[25px] text-[#1C3A2A] italic border-l-[3px] border-[#C0876B] pl-5 my-6 leading-[1.3]">
          « C&apos;est l&apos;âge, madame. Il faut faire avec. »
        </blockquote>

        <p className="mb-4">
          Un autre lui a dit que c&apos;était « peut-être dans la tête », « le stress », « la déprime de la cinquantaine ». Le kiné la soulageait une heure, le paracétamol aussi — puis la douleur revenait, toujours. Elle a fini par avaler des anti-douleurs « comme des bonbons », jusqu&apos;à ce que son estomac n&apos;en puisse plus.
        </p>

        <p className="mb-4">
          Alors elle s&apos;est soignée seule. Glucosamine. Chondroïtine. Collagène à 40 € le pot. Curcuma seul. Oméga-3. Des gummies « spécial ménopause ». <strong>Huit produits en trois ans.</strong> Elle avait fini par compter ce que ça lui avait coûté — et elle en avait eu honte.
        </p>

        <blockquote className="pq text-[22px] md:text-[25px] text-[#1C3A2A] italic border-l-[3px] border-[#C0876B] pl-5 my-6 leading-[1.3]">
          « De l&apos;argent jeté par les fenêtres. À chaque fois le même espoir. À chaque fois, rien. »
        </blockquote>

        <p className="mb-4">
          Voici ce que j&apos;ai dit à Françoise — et ce que je veux vous dire, à vous aussi : si rien n&apos;a marché, <strong>ce n&apos;est pas votre faute.</strong> Le collagène, le curcuma seul, les oméga-3 : ils ne font que <strong>masquer</strong>. Aucun ne touche la cause. Ils visaient tous le mauvais endroit. Parce que personne ne lui avait posé la bonne question.
        </p>

        {/* Section 4 */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          La question que personne ne lui avait posée
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/helene.png"
            alt="Hélène Vasseur en consultation"
            className="w-full h-auto rounded-[14px]"
          />
        </figure>

        <p className="mb-4">
          Ce jour-là, je ne lui ai pas parlé de ses hanches. Je lui ai posé une question qui l&apos;a déconcertée :
        </p>

        <blockquote className="pq text-[22px] md:text-[25px] text-[#1C3A2A] italic border-l-[3px] border-[#C0876B] pl-5 my-6 leading-[1.3]">
          « Et votre digestion, votre transit — comment ça va, depuis la ménopause ? »
        </blockquote>

        <p className="mb-4">
          Elle m&apos;a regardée, surprise. <em>« Plutôt mal, en fait… mais quel rapport avec mes articulations ? »</em>
        </p>

        <p className="mb-6">
          Le rapport, c&apos;est toute l&apos;histoire. Et c&apos;est là, dans son intestin, que se cachait la cause que ses cinq médecins n&apos;avaient jamais cherchée.
        </p>

        {/* Section 5: The Mechanism */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Le vrai mécanisme — celui qu&apos;on ne vous explique jamais
        </h2>

        <p className="mb-4">Suivez-moi. C&apos;est simple, et ça change tout.</p>

        <p className="mb-4">
          Vos tendons et vos articulations ont besoin d&apos;<strong>œstrogène</strong> pour rester souples. L&apos;œstrogène, c&apos;est ce qui les garde lubrifiés, élastiques. Tant que vous en avez, tout glisse.
        </p>

        <p className="mb-4">
          À la ménopause, votre corps en produit beaucoup moins. L&apos;œstrogène <strong>n&apos;atteint plus la hanche</strong> comme avant. Et là, les tendons s&apos;assèchent. Ils perdent leur souplesse. Ils deviennent raides. Et douloureux. <strong>Voilà ce qui brûle la nuit.</strong>
        </p>

        <figure className="my-5">
          <img
            src="/images/naylo/science.png"
            alt="Recherche scientifique sur les bactéries de l'intestin"
            className="w-full h-auto rounded-[14px]"
          />
          <figcaption className="text-[13.5px] text-[#6B6B61] text-center mt-2 italic">
            L&apos;estrobolome : les bactéries de l&apos;intestin qui recyclent vos œstrogènes.
          </figcaption>
        </figure>

        <p className="mb-4">
          Mais voici ce que presque personne ne sait. Votre œstrogène n&apos;est pas géré que par vos ovaires. <strong>Une partie est recyclée par votre intestin.</strong> Dans votre ventre vit une communauté de bactéries que les chercheurs appellent l&apos;<strong>estrobolome</strong>. Son rôle : reprendre l&apos;œstrogène que votre corps fabrique encore et le remettre en circulation.
        </p>

        {/* Note block */}
        <div className="bg-[#1C3A2A] text-[#EAF1E8] rounded-[16px] p-6 my-6">
          <h3 className="text-[#F0D9CC] text-[20px] font-bold mb-2">Voici le problème.</h3>
          <p className="text-[16.5px] leading-[1.6]">
            À la ménopause, les bactéries qui font ce recyclage s&apos;éteignent. Vous fabriquez encore un peu d&apos;œstrogène — mais votre intestin ne le récupère plus. Il part à la poubelle. Vos tendons, eux, n&apos;en voient jamais la couleur. C&apos;est comme un moteur qui tourne à sec.
          </p>
        </div>

        <p className="mb-4">
          Et c&apos;est là que la recherche a fait une découverte. Des chercheurs japonais ont identifié la <strong>souche de bactérie qui relance ce recyclage</strong> : le <strong>Lactobacillus gasseri SBT2055</strong>. C&apos;est elle qui est au cœur de Naylo.
        </p>

        <p className="mb-4">
          Voilà pourquoi le collagène de Françoise ne « prenait » jamais : sans œstrogène pour le fixer, il glissait sur des tendons à sec. <em>C&apos;est comme repeindre un mur mouillé : ça ne tient pas.</em> Voilà pourquoi les anti-douleurs ne faisaient que cacher le signal. Et voilà pourquoi le curcuma seul, les oméga-3, la glucosamine ne touchaient jamais la vraie cause.
        </p>

        <p className="font-bold text-[#1C3A2A] mb-6">
          Ce n&apos;était jamais dans ses hanches. C&apos;était dans son intestin.
        </p>

        {/* Section 6 */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Pourquoi votre médecin ne vous en parle (presque) jamais
        </h2>

        <p className="mb-4">
          Ce n&apos;est pas de la mauvaise volonté. La médecine générale a appris à regarder le cartilage et à mettre le mot « arthrose » sur beaucoup de douleurs après 50 ans. Le lien intestin–hormones–tendons, lui, est récent : la souche clé, le <strong>Lactobacillus gasseri SBT2055</strong>, a été identifiée par des chercheurs japonais à partir de 2019.
        </p>

        <p className="mb-6">
          Autrement dit : si on ne vous en a jamais parlé, ce n&apos;est pas parce que vos douleurs sont imaginaires, ni « dans votre tête ». C&apos;est simplement que <strong>l&apos;information est récente.</strong> Vos douleurs sont réelles. Et leur cause hormonale, longtemps ignorée, change tout.
        </p>

        {/* Section 7 */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          La découverte qui a tout changé pour Françoise
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/lifestyle.png"
            alt="Mains tenant le complément Naylo"
            className="w-full h-auto rounded-[14px]"
          />
        </figure>

        <p className="mb-4">
          C&apos;est exactement cette piste qui a donné naissance à <strong>Naylo</strong>. Une formule construite autour de la souche qui relance le recyclage de votre œstrogène. <strong>Pas une hormone. Juste votre corps qui réutilise le sien.</strong>
        </p>

        <p className="mb-6">
          Au cœur de la formule : le <strong>L. gasseri SBT2055</strong>, la souche identifiée au Japon. Et autour, quatre actifs choisis pour soutenir le même objectif.
        </p>

        {/* Section 8: Formula */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Ce qu&apos;il y a vraiment dans chaque gélule
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/ingredients.png"
            alt="Moringa, curcuma, hélichryse"
            className="w-full h-auto rounded-[14px]"
          />
        </figure>

        <div className="bg-white border border-[#E4E0D4] rounded-[14px] p-5 mb-6 space-y-3">
          <p className="mb-0">
            <strong>· Lactobacillus gasseri SBT2055</strong> (200 mg, le dosage étudié au Japon) — la souche qui relance le recyclage de l&apos;œstrogène. C&apos;est le cœur de tout.
          </p>
          <p className="mb-0">
            <strong>· Curcuma + BioPerine®</strong> — absorption multipliée par 39. Le curcuma calme l&apos;inflammation ; seul, il est presque inutilisable par le corps. Avec la BioPerine, il passe enfin.
          </p>
          <p className="mb-0">
            <strong>· Feuille de Moringa (350 mg)</strong> — superaliment végétal pour soutenir les tendons et la production naturelle de collagène.
          </p>
          <p className="mb-0">
            <strong>· Hélichryse italienne</strong> — plante noble traditionnellement reconnue pour le confort des tissus.
          </p>
          <p className="mb-0">
            <strong>· Lécithine de tournesol</strong> — optimise la biodisponibilité de l&apos;ensemble de la formule.
          </p>
        </div>

        <p className="mb-4">
          Et une différence essentielle avec les compléments « fourre-tout » de pharmacie : des ferments avalés en gélule classique sont détruits par l&apos;acidité de l&apos;estomac avant même d&apos;atteindre l&apos;intestin. C&apos;est pour ça que Naylo se présente en <strong>gélules végétales gastro-résistantes</strong> : la souche arrive vivante là où elle doit agir.
        </p>

        <p className="mb-6">
          <strong>Marque française.</strong> 100 % végane, sans gluten ni lactose, sans OGM. Deux gélules le matin, au petit-déjeuner. Dix secondes. Aucun régime, rien à changer dans votre vie.
        </p>

        {/* Section 9: Timeline */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Soyons honnêtes : ce n&apos;est pas magique en 3 jours
        </h2>

        <p className="mb-4">
          Je ne vais pas vous mentir, parce que personne ne l&apos;a fait avec Françoise et qu&apos;elle me l&apos;a reproché. <strong>Naylo n&apos;agit pas en trois jours.</strong> On ne ré-ensemence pas un intestin du jour au lendemain. Comptez <strong>4 à 6 semaines</strong> pour que la souche s&apos;installe et que le recyclage se relance. Voici comment ça s&apos;est passé pour Françoise.
        </p>

        {/* Roadmap steps */}
        <div className="space-y-4 my-6">
          <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#E4E0D4]">
            <span className="w-8 h-8 rounded-full bg-[#EEF3EC] text-[#1C3A2A] font-extrabold flex items-center justify-center flex-shrink-0 text-sm">1</span>
            <div>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#C0876B]">Semaine 1–2</span>
              <h3 className="text-[17px] font-bold text-[#1C3A2A] mb-1">La raideur du matin s&apos;allège</h3>
              <p className="text-[15px] text-[#6B6B61] leading-relaxed mb-0">Le « déverrouillage » au réveil lui a semblé plus court. Les premiers gestes du matin, plus faciles.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#E4E0D4]">
            <span className="w-8 h-8 rounded-full bg-[#EEF3EC] text-[#1C3A2A] font-extrabold flex items-center justify-center flex-shrink-0 text-sm">2</span>
            <div>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#C0876B]">Semaine 3</span>
              <h3 className="text-[17px] font-bold text-[#1C3A2A] mb-1">Les gestes du quotidien reviennent</h3>
              <p className="text-[15px] text-[#6B6B61] leading-relaxed mb-0">Monter l&apos;escalier, se relever d&apos;une chaise — avec moins d&apos;appréhension.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-[#EEF3EC] p-4 rounded-xl border-2 border-[#C0876B]">
            <span className="w-8 h-8 rounded-full bg-[#C0876B] text-white font-extrabold flex items-center justify-center flex-shrink-0 text-sm">3</span>
            <div>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#C0876B]">Semaine 4–6</span>
              <h3 className="text-[17px] font-bold text-[#1C3A2A] mb-1">La souplesse revient</h3>
              <p className="text-[15px] text-[#33332C] leading-relaxed mb-0">Françoise dort à nouveau sur le côté, toute la nuit. Elle décrit une légèreté qu&apos;elle avait oubliée.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#E4E0D4]">
            <span className="w-8 h-8 rounded-full bg-[#EEF3EC] text-[#1C3A2A] font-extrabold flex items-center justify-center flex-shrink-0 text-sm">4</span>
            <div>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#C0876B]">Mois 3</span>
              <h3 className="text-[17px] font-bold text-[#1C3A2A] mb-1">On entretient le terrain</h3>
              <p className="text-[15px] text-[#6B6B61] leading-relaxed mb-0">La cure se poursuit dans la durée, dans le cadre d&apos;une bonne hygiène de vie.</p>
            </div>
          </div>
        </div>

        {/* Table Françoise */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Le journal de Françoise
        </h2>
        <p className="mb-4">
          Pendant sa cure, je lui avais demandé de tenir un petit « journal de mobilité ». Voici ce qu&apos;elle y a noté, entre son premier jour et la fin de sa 8ᵉ semaine.
        </p>

        <div className="overflow-x-auto my-5">
          <table className="w-full bg-white border border-[#E4E0D4] rounded-xl overflow-hidden text-left text-[15.5px]">
            <thead>
              <tr className="bg-[#EEF3EC] text-[#1C3A2A] font-extrabold border-b border-[#E4E0D4]">
                <th className="p-3">Au quotidien</th>
                <th className="p-3">Avant</th>
                <th className="p-3 text-[#1C3A2A]">Après 8 semaines</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E4E0D4]">
                <td className="p-3 font-medium">« Déverrouillage » du matin</td>
                <td className="p-3 text-[#6B6B61]">~25 min</td>
                <td className="p-3 font-bold text-[#1C3A2A]">~1 min</td>
              </tr>
              <tr className="border-b border-[#E4E0D4]">
                <td className="p-3 font-medium">Réveils nocturnes (hanche)</td>
                <td className="p-3 text-[#6B6B61]">3 à 4 / nuit</td>
                <td className="p-3 font-bold text-[#1C3A2A]">0</td>
              </tr>
              <tr className="border-b border-[#E4E0D4]">
                <td className="p-3 font-medium">Marche sans gêne</td>
                <td className="p-3 text-[#6B6B61]">~500 m</td>
                <td className="p-3 font-bold text-[#1C3A2A]">5 km</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Jardiner, accroupie</td>
                <td className="p-3 text-[#6B6B61]">Impossible</td>
                <td className="p-3 font-bold text-[#1C3A2A]">2 h d&apos;affilée</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reviews Grid */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Elles aussi cherchaient une solution
        </h2>
        <p className="text-[14px] text-[#6B6B61] mb-5">
          <span className="text-[#C0876B] font-bold">★★★★★</span> 4,8/5 · plus de 4 000 avis vérifiés
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-white border border-[#E4E0D4] rounded-xl overflow-hidden shadow-sm">
            <img src="/images/naylo/rev1.jpg" alt="Catherine L." className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-[#C0876B] text-sm">★★★★★</div>
              <p className="text-[14px] italic my-2">« J&apos;avais arrêté le vélo à cause de mes hanches. La semaine dernière, j&apos;ai refait 15 km au bord du lac. Je pleure en écrivant ça. »</p>
              <strong className="text-[#1C3A2A] text-sm">Catherine L.</strong> <span className="text-[#2E9E5B] text-xs font-bold">✓ Achat vérifié</span>
            </div>
          </div>

          <div className="bg-white border border-[#E4E0D4] rounded-xl overflow-hidden shadow-sm">
            <img src="/images/naylo/rev2.png" alt="Isabelle M." className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-[#C0876B] text-sm">★★★★★</div>
              <p className="text-[14px] italic my-2">« Je dors à nouveau sur le côté, sans me réveiller. Mon mari n&apos;en revient pas. »</p>
              <strong className="text-[#1C3A2A] text-sm">Isabelle M.</strong> <span className="text-[#2E9E5B] text-xs font-bold">✓ Achat vérifié</span>
            </div>
          </div>

          <div className="bg-white border border-[#E4E0D4] rounded-xl overflow-hidden shadow-sm">
            <img src="/images/naylo/rev3.png" alt="Laurence M." className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-[#C0876B] text-sm">★★★★★</div>
              <p className="text-[14px] italic my-2">« Mes mains étaient si raides le matin que je ne pouvais plus tenir ma tasse. Après 4 semaines, je refais mes gestes sans y penser. »</p>
              <strong className="text-[#1C3A2A] text-sm">Laurence M.</strong> <span className="text-[#2E9E5B] text-xs font-bold">✓ Achat vérifié</span>
            </div>
          </div>

          <div className="bg-white border border-[#E4E0D4] rounded-xl overflow-hidden shadow-sm">
            <img src="/images/naylo/rev4.png" alt="Juliette T." className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-[#C0876B] text-sm">★★★★★</div>
              <p className="text-[14px] italic my-2">« 8 compléments essayés en 3 ans. Rien. Naylo est le premier qui m&apos;a expliqué que mes douleurs venaient de mes hormones, pas de mes articulations. »</p>
              <strong className="text-[#1C3A2A] text-sm">Juliette T.</strong> <span className="text-[#2E9E5B] text-xs font-bold">✓ Achat vérifié</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Preview */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          L&apos;offre réservée aux lectrices de ce dossier
        </h2>

        <div className="flex flex-col gap-3.5 my-6">
          {/* Pack 30 jours */}
          <Link href={productUrl} className="block bg-white border border-[#E4E0D4] rounded-2xl p-5 hover:border-[#1C3A2A] transition">
            <div className="font-extrabold text-[#1C3A2A] text-lg">Pack Découverte — 30 jours</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1C3A2A]">34,90 €</span>
              <span className="text-sm text-[#6B6B61]">· soit 1,16 €/jour</span>
            </div>
            <div className="text-xs text-[#6B6B61] mt-1">Pour découvrir la formule.</div>
          </Link>

          {/* Pack 90 jours (Featured) */}
          <Link href={productUrl} className="block bg-[#EEF3EC] border-2 border-[#C0876B] rounded-2xl p-5 relative shadow-md hover:scale-[1.01] transition">
            <span className="absolute -top-3 left-5 bg-[#C0876B] text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              Le plus choisi ⭐
            </span>
            <div className="font-extrabold text-[#1C3A2A] text-lg mt-1">Pack Mobilité — 90 jours (3 Flacons)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C3A2A]">69,80 €</span>
              <span className="line-through text-sm text-[#6B6B61]">104,70 €</span>
              <span className="text-sm text-[#2E9E5B] font-bold">· soit 0,78 €/jour</span>
            </div>
            <div className="text-xs font-bold text-[#1C3A2A] mt-2">
              🚚 Livraison offerte · 🎁 Guide « 14 recettes anti-inflammatoires » offert
            </div>
          </Link>

          {/* Pack 6 mois */}
          <Link href={productUrl} className="block bg-white border border-[#E4E0D4] rounded-2xl p-5 hover:border-[#1C3A2A] transition">
            <div className="font-extrabold text-[#1C3A2A] text-lg">Transformation — 6 mois (6 Flacons)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1C3A2A]">99,90 €</span>
              <span className="line-through text-sm text-[#6B6B61]">209,40 €</span>
              <span className="text-sm text-[#2E9E5B] font-bold">· soit 0,55 €/jour</span>
            </div>
            <div className="text-xs font-bold text-[#1C3A2A] mt-2">
              🚚 Livraison offerte · 🎁 La cure complète pour ancrer les résultats
            </div>
          </Link>
        </div>

        {/* CTA Button 1 */}
        <Link
          href={productUrl}
          className="block w-full bg-[#1C3A2A] hover:bg-[#2E5240] text-white font-extrabold text-[19px] py-4 px-6 rounded-xl text-center shadow-lg transition duration-200 my-6"
        >
          Voir les offres &amp; la cure complète →
        </Link>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 my-6 text-[13px] font-bold text-[#1C3A2A]">
          <div className="bg-[#EEF3EC] p-3 rounded-xl flex items-center gap-2">🛡️ Garantie 60 jours</div>
          <div className="bg-[#EEF3EC] p-3 rounded-xl flex items-center gap-2">🇫🇷 Marque française</div>
          <div className="bg-[#EEF3EC] p-3 rounded-xl flex items-center gap-2">🚚 Livraison suivie</div>
          <div className="bg-[#EEF3EC] p-3 rounded-xl flex items-center gap-2">🔒 Paiement sécurisé</div>
        </div>

        {/* Guarantee Box */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          La garantie « Je Revis » : 60 jours, ou vous êtes remboursée
        </h2>
        <div className="bg-[#1C3A2A] text-[#EAF1E8] rounded-2xl p-6 my-6">
          <p className="mb-3 text-[16px]">
            Essayez Naylo pendant 60 jours. <strong className="text-white">Si rien ne change</strong>, pour quelque raison que ce soit, écrivez-nous : nous vous remboursons <strong className="text-white">jusqu&apos;au dernier centime</strong>. Vous pouvez même nous renvoyer les boîtes vides. Pas de formulaire compliqué, pas de question piège.
          </p>
          <p className="text-[#F0D9CC] font-bold text-[16px] mb-0">
            Le risque, c&apos;est nous qui le prenons. Le seul risque pour vous, c&apos;est de continuer comme avant — et de regarder une saison de plus filer entre vos doigts.
          </p>
        </div>

        {/* FAQs */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Vos questions, mes réponses
        </h2>

        <div className="space-y-3 my-6">
          <details className="bg-white border border-[#E4E0D4] rounded-xl p-4 cursor-pointer">
            <summary className="font-bold text-[#1C3A2A]">Comment un produit pour l&apos;intestin peut-il agir sur ma hanche ?</summary>
            <p className="mt-3 text-[15px] text-[#6B6B61] leading-relaxed mb-0">
              Parce que votre intestin recycle votre œstrogène, et que c&apos;est l&apos;œstrogène qui garde vos tendons souples. Naylo est un complément alimentaire qui relance ce recyclage. Il accompagne le confort articulaire dans le cadre d&apos;une bonne hygiène de vie.
            </p>
          </details>

          <details className="bg-white border border-[#E4E0D4] rounded-xl p-4 cursor-pointer">
            <summary className="font-bold text-[#1C3A2A]">J&apos;ai déjà tout essayé. Pourquoi ce serait différent ?</summary>
            <p className="mt-3 text-[15px] text-[#6B6B61] leading-relaxed mb-0">
              Parce que tout ce que vous avez essayé visait le cartilage (glucosamine, collagène) ou masquait la douleur (anti-inflammatoires). Naylo s&apos;attaque à la cause hormonale, celle de l&apos;estrobolome. Si rien n&apos;a marché, ce n&apos;est pas vous le problème — c&apos;est que vous cherchiez au mauvais endroit.
            </p>
          </details>

          <details className="bg-white border border-[#E4E0D4] rounded-xl p-4 cursor-pointer">
            <summary className="font-bold text-[#1C3A2A]">En combien de temps vais-je sentir une différence ?</summary>
            <p className="mt-3 text-[15px] text-[#6B6B61] leading-relaxed mb-0">
              Soyons honnêtes : ce n&apos;est pas magique en 3 jours. Comptez 4 à 6 semaines pour que la souche s&apos;installe. Les ressentis sont variables ; on recommande une cure d&apos;au moins 3 mois.
            </p>
          </details>

          <details className="bg-white border border-[#E4E0D4] rounded-xl p-4 cursor-pointer">
            <summary className="font-bold text-[#1C3A2A]">Et si ça ne marche pas pour moi ?</summary>
            <p className="mt-3 text-[15px] text-[#6B6B61] leading-relaxed mb-0">
              Vous êtes couverte par la garantie 60 jours : remboursée si rien ne change, à 100 %, boîtes vides acceptées. Vous ne prenez aucun risque financier.
            </p>
          </details>
        </div>

        {/* Final Granddaughter Scene */}
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#1C3A2A] mt-9 mb-3">
          Le mot de la fin
        </h2>

        <figure className="my-5">
          <img
            src="/images/naylo/grandma.png"
            alt="Femme soulevant sa petite-fille dans le jardin, rayonnante de joie"
            className="w-full h-auto rounded-[14px]"
          />
        </figure>

        <p className="mb-4">
          Six semaines après le début de sa cure, dans le jardin, la même petite-fille a de nouveau tendu les bras. <em>« Mamie, porte-moi ! »</em>
        </p>

        <p className="mb-4">
          Cette fois, Françoise l&apos;a soulevée. <strong>Pour de vrai.</strong> Elle l&apos;a fait tourner dans l&apos;herbe jusqu&apos;à ce qu&apos;elles éclatent de rire toutes les deux. Et elle a encore pleuré — mais plus du tout pour les mêmes raisons.
        </p>

        <blockquote className="pq text-[22px] md:text-[25px] text-[#1C3A2A] italic border-l-[3px] border-[#C0876B] pl-5 my-6 leading-[1.3]">
          « Je ne savais pas que je pouvais redevenir moi. Je revis. »
        </blockquote>

        <p className="mb-4">
          Alors je vous le dis avec le cœur : ce n&apos;est <em>pas</em> l&apos;âge. Ce n&apos;est pas dans votre tête. C&apos;est l&apos;œstrogène — et ça, on peut le relancer. Cette femme que vous croyez avoir perdue — celle qui marchait des heures, qui jardinait, qui se levait le matin sans même y penser — <strong>elle est encore là. Elle attend juste que vous regardiez au bon endroit.</strong>
        </p>

        <p className="font-extrabold text-[#1C3A2A] mt-2 mb-6">
          — Hélène Vasseur, naturopathe
        </p>

        {/* Final Main CTA */}
        <Link
          href={productUrl}
          className="block w-full bg-[#1C3A2A] hover:bg-[#2E5240] text-white font-extrabold text-[19px] py-4 px-6 rounded-xl text-center shadow-xl transition duration-200 mt-8 mb-3"
        >
          Je commence ma cure Naylo →
        </Link>
        <p className="text-center text-xs text-[#6B6B61]">
          🛡️ 60 jours, remboursée si rien ne change · 🇫🇷 Marque française · 🔒 Paiement sécurisé
        </p>
      </article>

      {/* Sticky Floating CTA */}
      <div
        className={`fixed left-0 right-0 bottom-4 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none ${
          showFloatingCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <Link
          href={productUrl}
          className="pointer-events-auto w-full max-w-[540px] bg-[#1C3A2A] hover:bg-[#2E5240] text-[#FBF8F1] font-extrabold text-[16px] text-center py-3.5 px-6 rounded-full shadow-2xl transition duration-200 border border-[#9FB8A4]/40"
        >
          Voir l&apos;offre &amp; la cure complète →
        </Link>
      </div>
    </div>
  );
}
