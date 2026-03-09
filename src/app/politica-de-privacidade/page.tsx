import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Última atualização: 09 de Março de 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introdução</h2>
            <p>
              A Siloferr Peças e Equipamentos Agrícolas ("nós", "nosso") respeita a sua privacidade e está comprometida em proteger os dados pessoais que você compartilha conosco. Esta política explica como coletamos, usamos e protegemos suas informações, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Dados que Coletamos</h2>
            <p>Podemos coletar os seguintes tipos de dados:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Dados de Contato:</strong> Nome, e-mail, telefone (quando preenchidos em formulários de contato ou orçamento).</li>
              <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas (via cookies e logs de servidor para segurança e análise).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Finalidade do Uso dos Dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Responder a solicitações de orçamento e dúvidas.</li>
              <li>Melhorar a experiência de navegação em nosso site.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Compartilhamento de Dados</h2>
            <p>
              Não vendemos nem alugamos seus dados pessoais. Podemos compartilhar informações apenas com prestadores de serviços essenciais (como hospedagem de site) ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
            <p>
              Utilizamos cookies para garantir o funcionamento correto do site e analisar o tráfego. Você pode gerenciar as preferências de cookies diretamente nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Seus Direitos (LGPD)</h2>
            <p>Você tem o direito de:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Confirmar a existência de tratamento de dados.</li>
              <li>Acessar seus dados.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>Solicitar a exclusão de dados desnecessários.</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato conosco através do e-mail: <a href="mailto:contato@siloferr.com.br" className="text-blue-600 hover:underline">contato@siloferr.com.br</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Segurança</h2>
            <p>
              Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados e situações acidentais ou ilícitas de destruição, perda ou alteração.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contato</h2>
            <p>
              Se tiver dúvidas sobre esta política, entre em contato conosco:<br />
              <strong>Siloferr Peças e Equipamentos Agrícolas</strong><br />
              E-mail: contato@siloferr.com.br
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
