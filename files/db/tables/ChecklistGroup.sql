CREATE TABLE [dbo].[ChecklistGroups] (
    [Id] nvarchar(100) NOT NULL,
    [Order] int NOT NULL,
    [Description] nvarchar(255) NOT NULL,
    CONSTRAINT [ChecklistGroups_PK] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [ChecklistGroups_UQ] UNIQUE ([Order] ASC)
)