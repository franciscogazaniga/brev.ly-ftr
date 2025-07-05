-- 1. Remover default antigo (tipo texto)
ALTER TABLE "links" ALTER COLUMN "access_count" DROP DEFAULT;

-- 2. Converter o tipo
ALTER TABLE "links" ALTER COLUMN "access_count" SET DATA TYPE integer USING access_count::integer;

-- 3. Adicionar default novo como inteiro
ALTER TABLE "links" ALTER COLUMN "access_count" SET DEFAULT 0;