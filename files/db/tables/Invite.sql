DROP TABLE [dbo].[Invites]
GO

CREATE TABLE [dbo].[Invites]
(
    [Id] NVARCHAR(50) NOT NULL,
    [Email] NVARCHAR(255) NOT NULL,
    [OrganizationId] NVARCHAR(100) NOT NULL,
    [InvitedById] NVARCHAR(50) NOT NULL,
    [CreationDate] DATETIMEOFFSET NOT NULL,
    [LastModifiedDate] DATETIMEOFFSET NOT NULL,
    [LastInviteSentDate] DATETIMEOFFSET NULL,
    [SignupDate] DATETIMEOFFSET NULL,
    [Roles] NVARCHAR(MAX) NULL,
    [Cancelled] BIT NOT NULL,
    CONSTRAINT [PK_Invites] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Invites_Organizations] FOREIGN KEY ([OrganizationId]) REFERENCES [dbo].[Organization]([Id]) ON DELETE CASCADE
);
