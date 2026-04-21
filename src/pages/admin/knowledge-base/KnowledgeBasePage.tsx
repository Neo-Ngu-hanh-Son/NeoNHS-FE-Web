import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { message } from 'antd';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { knowledgeApi, type KnowledgeDocument } from '@/services/api/knowledgeApi';
import {
  extractDocuments,
  isInformationKnowledge,
  isSystemPromptKnowledge,
} from './knowledge-helpers';
import { KnowledgeBasePageHeader } from './components/KnowledgeBasePageHeader';
import { AiSystemPromptTab } from './components/AiSystemPromptTab';
import { KnowledgeArticlesTab } from './components/KnowledgeArticlesTab';

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await knowledgeApi.getDocuments(0, 100);
      setDocuments(extractDocuments(res));
    } catch {
      message.error('Không thể tải cơ sở dữ liệu tri thức');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const informationDocs = useMemo(
    () => documents.filter(isInformationKnowledge),
    [documents],
  );

  const systemPromptDoc = useMemo(
    () => documents.find(isSystemPromptKnowledge) ?? null,
    [documents],
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-6"
      >
        <KnowledgeBasePageHeader />

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 gap-1 bg-slate-100/80 p-1 dark:bg-slate-900/60">
            <TabsTrigger value="prompt" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Cấu hình AI
            </TabsTrigger>
            <TabsTrigger value="articles" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
              Tri thức AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="mt-6 focus-visible:outline-none">
            <AiSystemPromptTab systemPromptDoc={systemPromptDoc} onRefresh={fetchAll} />
          </TabsContent>

          <TabsContent value="articles" className="mt-6 focus-visible:outline-none">
            <KnowledgeArticlesTab articles={informationDocs} loading={loading} onRefresh={fetchAll} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
