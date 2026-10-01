import React, { useState } from 'react';
import { BookOpen, Calendar, User, ArrowRight, MessageCircle, X } from 'lucide-react';
import { buildAdminWhatsAppLink } from '../config/contact';

const BLOG_ARTICLES = [
  {
    id: 'post_1',
    title: 'Comment Tripler le ROI de vos Publicités Google Ads & Meta en 2026',
    category: 'Acquisition',
    author: 'TTES-ICG Growth Team',
    date: '14 Août 2026',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    summary: 'Découvrez les nouvelles règles du ciblage publicitaire assisté par IA, la structure des comptes d’élite et la création de landing pages qui convertissent à plus de 12%.',
    content: `
      Le paysage de l'acquisition payante a radicalement évolué en 2026. Les algorithmes de Meta Ads et Google Ads exigent désormais une structure de campagne épurée et des créatives haute définition.

      ### 1. La Fin des Ciblage Micro-Segmentés
      Les stratégies d'hyper-ciblage manuel cèdent la place au ciblage large (Broad Targeting) alimenté par le machine learning. Ce qui fait désormais la différence, ce n'est plus l'audience choisie dans l'outil, mais la clarté de votre message visuel.

      ### 2. Des Landing Pages Conçues pour le Mobile
      En Afrique et sur les marchés émergents, plus de 88% du trafic provient de terminaux mobiles. Une landing page qui met plus de 2 secondes à charger détruit votre retour sur investissement.

      ### 3. Automatisation des Relances sur WhatsApp
      Combiner Google Ads avec un canal de conversion WhatsApp direct permet d'augmenter le taux de conversion final de +340%.
    `
  },
  {
    id: 'post_2',
    title: 'Guide SEO Afrique 2026 : Dominer les Moteurs de Recherche Locaux',
    category: 'SEO',
    author: 'Expert Sémantique TTES-ICG',
    date: '02 Août 2026',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    summary: 'Les opportunités SEO méconnues en Afrique Centrale et de l’Ouest. Comment capturer les recherches à haute intention d’achat avant vos concurrents.',
    content: `
      Le volume de recherche sur Google connaît une croissance exponentielle dans les métropoles africaines comme Douala, Yaoundé, Abidjan et Dakar.

      ### 1. Optimiser pour les Mots-Clés Géolocalisés
      Positionner votre marque sur des intentions d'achat directes (ex: "agence marketing Douala", "devis travaux Yaoundé") garantit un trafic qualifié à zéro coût publicitaire.

      ### 2. Le Netlinking & l'Autorité de Domaine
      Acquérir des liens depuis des médias régionaux accroit l'autorité de votre domaine aux yeux de Google.
    `
  },
  {
    id: 'post_3',
    title: 'L’Art du Copywriting B2B : Rédiger des Emails de Prospection Irrésistibles',
    category: 'Inbound',
    author: 'Pôle Copywriting',
    date: '25 Juillet 2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=800&q=80',
    summary: 'Les structures de messages utilisées par les plus grands cabinets de conseil pour décrocher des rendez-vous avec les directeurs généraux.',
    content: `
      La prospection B2B traditionnelle est morte. Les décideurs reçoivent des dizaines d'emails génériques par jour. Pour capter leur attention en 2026, vous devez adopter la méthode PASTOR (Problème, Amplification, Solution, Témoignage, Offre, Réponse).
    `
  }
];

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="section-padding">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            <BookOpen size={14} /> Blog & Actualités TTES-ICG
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }} className="text-gradient">
            Conseils, Stratégies & Insights Marketing
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
            Découvrez nos analyses, guides pratiques et tendances pour accélérer la croissance de votre entreprise.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid-3" style={{ gap: '30px' }}>
          {BLOG_ARTICLES.map(post => (
            <div
              key={post.id}
              className="glass-panel"
              style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                  <span className="badge badge-purple">{post.category}</span>
                  <span>• {post.readTime} de lecture</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '10px' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
                  {post.summary}
                </p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{post.date}</span>
                <button className="btn btn-sm btn-outline" onClick={() => setSelectedPost(post)}>
                  Lire l'article <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Reader */}
        {selectedPost && (
          <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
            <div className="modal-content glass-card-lg" style={{ maxWidth: '800px', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#FFF', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>
                <X size={18} />
              </button>

              <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>{selectedPost.category}</span>
              <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '16px' }}>{selectedPost.title}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
                Par {selectedPost.author} • Le {selectedPost.date}
              </div>

              <div style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {selectedPost.content}
              </div>

              <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                <button type className="btn btn-primary" onClick={() => {
                  setSelectedPost(null);
                  window.open(buildAdminWhatsAppLink(`Bonjour TTES-ICG, j'ai lu votre article "${selectedPost.title}" et souhaite des précisions.`), '_blank');
                }}>
                  <MessageCircle size={18} /> Poser une question sur WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
