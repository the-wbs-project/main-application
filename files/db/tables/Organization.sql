CREATE TABLE [dbo].[Organization]
(
    [Id] NVARCHAR(100) NOT NULL,
    [Name] NVARCHAR(100) NOT NULL,
    [AiModels] NVARCHAR(MAX) NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [UpdatedAt] DATETIME NOT NULL,
    CONSTRAINT [Organization_PK] PRIMARY KEY CLUSTERED ([Id] ASC)
);