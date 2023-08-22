CREATE TABLE dbo.Lists (
    [Type] nvarchar(100) NOT NULL,
    [Id] nvarchar(100) NOT NULL,
    [Label] nvarchar(100) NOT NULL,
    [SameAs] nvarchar(100) NULL,
    [Icon] nvarchar(100) NULL,
    [Description] nvarchar(100) NULL,
    [Tags] nvarchar(MAX) NULL,
    CONSTRAINT [PK_Lists] PRIMARY KEY CLUSTERED ([Type] ASC, [Id] ASC)
)